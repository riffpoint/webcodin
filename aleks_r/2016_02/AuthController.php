<?php
/**
 * Class AuthController
 * @package App\Http\Controllers\Auth
 * @author WebCodin <info@webcodin.com>
 */
namespace App\Http\Controllers\Auth;

use App\Helpers\Contracts\EmailTokenContract;
use App\Models\User;
use App\Models\UserSocial;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Auth;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\View\View;
use App\Helpers\Contracts\EmailTokenContract as EmailToken;
use Laravel\Socialite\AbstractUser;
use Socialite;
use Exception;
use Illuminate\Support\Str;

class AuthController extends Controller
{

    /**
     * AuthController constructor.
     * Apply "guest" middleware for all "auth" routes except logout
     */
    public function __construct()
    {
        $this->middleware('guest', ['except' => 'logout']);
    }

    /**
     * Login action
     * Show login form & authorization process
     *
     * @param Request $request
     * @return RedirectResponse|View
     */
    public function login(Request $request)
    {
        $data = array();
        if ($request->isMethod('POST')) {
            $rules = [
                'email'    => 'required|email',
                'password' => 'required',
            ];
            $messages = [
                'g-recaptcha-response.required' => 'Prove you\'re not a robot!',
                'g-recaptcha-response.recaptcha' => 'o_O Are you robot?',
            ];
            if ($request->exists('g-recaptcha-response')) {
                $rules['g-recaptcha-response'] = 'required|recaptcha';
            }
            $validator = Validator::make($request->all(), $rules, $messages);
            if ($validator->fails()) {
                return redirect()->route('auth::login')->withErrors($validator)->with('need-recaptcha', true);
            }
            $credentials = $request->only('email', 'password');
            $auth = Auth::attempt($credentials, $request->has('remember'));
            if ($auth) {
                if (!Auth::user()->confirmed) {
                    $redirect = $this->goToNeedConfirm(Auth::user());
                    Auth::logout();
                    return $redirect;
                }
                return redirect()->intended();
            } else {
                $data['error'] = 'Wrong credentials';
            }
        }
        return view('auth.login', $data);
    }

    /**
     * Registration action
     * Show registration form & registration process
     *
     * @param Request $request
     * @param EmailToken $et
     * @return RedirectResponse|View
     */
    public function registration(Request $request, EmailTokenContract $et)
    {
        if ($request->isMethod('POST')) {
            $this->validate($request, [
                'email'    => 'required|email|unique:users,email',
                'password' => 'required|min:6',
                'username' => 'required|unique:users,username|alpha_dash'
            ]);
            $et->registration($this->create($request->all()));
            $toastr = [
                'type' => 'info',
                'message' => 'Confirmation link sent to your email',
                'title' => 'You successfully register'
            ];
            return redirect()->route('auth::login')->with('toastr', $toastr);
        }
        return view('auth.registration');
    }

    /**
     * Confirm action
     * Confirm user email address and remove confirmation code
     *
     * @param EmailToken $et
     * @param string $token
     * @return RedirectResponse
     */
    public function confirm(EmailTokenContract $et, $token)
    {
        if ($et->check($token) == EmailTokenContract::TOKEN_MATCH) {
            $etRepo = $et->getCurrentRepository();
            $user = User::where('email', $etRepo->email)->first();
            $user->confirmed = true;
            $user->save();
            $etRepo->delete();
            Auth::login($user);
            return redirect()->route('profile::dashboard');
        }
        abort(404, 'Wrong confirm code');
    }

    /**
     * Logout action
     *
     * @return RedirectResponse
     */
    public function logout()
    {
        Auth::logout();
        return redirect()->route('home');
    }

    /**
     * Password action
     * Reset user password
     *
     * @param Request $request
     * @param EmailToken $et
     * @return RedirectResponse|View
     */
    public function password(Request $request, EmailTokenContract $et)
    {
        if ($token = $request->route('token')) {
            if ($et->check($token) == EmailTokenContract::TOKEN_NOT_MATCH) {
                abort(404);
            }
            if ($et->check($token) == EmailTokenContract::TOKEN_EXPIRED) {
                $toastr = [
                    'type' => 'error',
                    'message' => 'Your token expired! Try one more time.',
                    'title' => 'Reset password error'
                ];
                return redirect()->route('auth::password')->with('toastr', $toastr);
            }
            if ($request->isMethod('POST')) {
                $this->validate($request, [
                    'password'    => 'required|min:6',
                ]);
                $etRepo = $et->getCurrentRepository();
                $user = User::where('email', $etRepo->email)->first();
                $user->password = bcrypt($request->input('password'));
                $user->save();
                $etRepo->delete();
                $toastr = [
                    'type' => 'success',
                    'title' => 'Password restore successfully',
                    'message' => 'Now you can login'
                ];
                return redirect()->route('auth::login')->with('toastr', $toastr);
            }
            return view('auth.passwordRestore')->with('token', $token);
        } else {
            if ($request->isMethod('POST')) {
                $validator = Validator::make($request->all(), [
                    'email'    => 'required|email',
                ]);
                $user = User::where('email', $request->input('email'))->first();
                $validator->after(function ($validator) use ($user) {
                    if (!$user instanceof User) {
                        $validator->errors()->add('email', 'User not found.');
                    }
                });
                if ($validator->fails()) {
                    return redirect()->route('auth::password')
                        ->withErrors($validator)
                        ->withInput();
                }
                $et->passwordReset($user);
                $toastr = [
                    'type' => 'info',
                    'message' => 'Reset password link sent to your email',
                    'title' => 'Request to reset password was successfully'
                ];
                return redirect()->route('auth::login')->with('toastr', $toastr);
            }
            return view('auth.password');
        }
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array $data
     * @return User
     */
    protected function create(array $data)
    {
        $user = User::create([
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);
        $info = isset($data['info']) ? $data['info'] : array();
        $user->info()->create($info);
        return $user;
    }

    /**
     * Auth with social
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function redirectToProvider(Request $request)
    {
        $driver = $request->route('driver');
        if (!config("services.$driver")) {
            abort('404');
        }
        return Socialite::driver($driver)->redirect();
    }

    /**
     * Social auth callback
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function handleProviderCallback(Request $request)
    {
        $driver = $request->route('driver');
        if ($request->has('code') || $request->has(['oauth_token', 'oauth_verifier'])) {
            try {
                $socialite = Socialite::driver($driver);
                if (method_exists($socialite, 'scopes')) {
                    $socialite->scopes(['email']);
                }
                $user = $socialite->user();
                return $this->socialRegister($user, $driver);
            } catch (Exception $e) {
                /**
                 * @todo process exception
                 */
                $toastr = [
                    'type' => 'error',
                    'message' => 'Something went wrong',
                    'title' => 'Error 1'
                ];
                return redirect()->route('auth::login')->with('toastr', $toastr);
            }
        } elseif ($request->query('error') == 'access_denied' || $request->has('denied')) {
            $toastr = [
                'type' => 'warning',
                'message' => 'You canceled auth',
                'title' => $driver
            ];
            return redirect()->route('auth::login')->with('toastr', $toastr);
        } elseif ($request->has('error')) {
            /**
             * @todo process error
             */
            $toastr = [
                'type' => 'error',
                'message' => 'Something went wrong',
                'title' => 'Error 2'
            ];
            return redirect()->route('auth::login')->with('toastr', $toastr);
        } else {
            abort(404);
        }
    }

    /**
     * Registration user who authenticate with social provider
     *
     * @param AbstractUser $social
     * @param string $provider
     * @return RedirectResponse
     */
    private function socialRegister(AbstractUser $social, $provider)
    {
        $socialUser = UserSocial::where('provider', $provider)->where('provider_id', $social->id)->first();
        if (!$socialUser) {
            if ($social->email) {
                $user = User::where('email', $social->email)->first();
                $user = $this->createSocialUser($social, $provider, true, $user);
                Auth::login($user, true);
            } else {
                session(['social-need-email' => $provider, 'social-auth' => $social]);
                return redirect()->route('auth::need.email');
            }
        } else {
            $user = $socialUser->user;
            if ($user->confirmed && !$user->suspended) {
                Auth::login($user, true);
            } else {
                return $this->goToNeedConfirm($user);
            }
        }
        return redirect()->intended();
    }

    /**
     * NeedEmail action
     * Show & process email input form for users who authenticate with social provider which deny email addresses
     *
     * @param Request $request
     * @param EmailToken $et
     * @return RedirectResponse|View
     */
    public function needEmail(Request $request, EmailTokenContract $et)
    {
        if ($request->session()->has('social-need-email') && $request->session()->has('social-auth')) {
            if ($request->isMethod('POST')) {
                $this->validate($request, [
                    'email'    => 'required|email|unique:users,email',
                ]);
                $email = $request->input('email');
                $provider = $request->session()->pull('social-need-email');
                $social = $request->session()->pull('social-auth');
                $social->email = $email;
                $user = $this->createSocialUser($social, $provider);
                $et->registration($user);
                $toastr = [
                    'type' => 'info',
                    'message' => 'Confirmation link sent to your email',
                    'title' => 'You successfully register'
                ];
                return redirect()->route('auth::login')->with('toastr', $toastr);
            }
            return view('auth.needEmail');
        }
        abort(404);
    }

    /**
     * Store user who authenticate with social provider
     *
     * @param AbstractUser $social
     * @param string $provider
     * @param bool $confirmed
     * @param User|null $user
     * @return User
     */
    private function createSocialUser($social, $provider, $confirmed = false, User $user = null)
    {
        $flag = false;
        if (!$user) {
            $user = new User();
            $user->email = $social->email;
            $user->password = bcrypt($social->email . Str::random() . $provider);
            $nickname = $social->nickname ?: $provider . '-' . $social->id;
            $validator = Validator::make(['username' => $nickname], ['username' => 'unique:users,username']);
            if ($validator->fails()) {
                $nickname = $provider . '-' . Str::random() . '-' . Carbon::now()->getTimestamp();
            }
            $user->username = $nickname;
            $flag = true;
        }
        $user->confirmed = $confirmed;
        $user->save();
        if ($flag) {
            $name = explode(' ', $social->name);
            if ($social->offsetExists('gender')) {
                $sex = $social->offsetGet('gender') == 'male' ? 1 : 2;
            } else {
                $sex = null;
            }
            $user->info()->create([
                'first_name' => isset($name[0]) ? trim($name[0]) : null,
                'last_name' => isset($name[1]) ? trim($name[1]) : null,
                'sex' => $sex,
            ]);
        }
        $data = [
            'provider' => $provider,
            'provider_id' => $social->id,
            'name' => $social->name,
            'email' => $social->email,
            'avatar' => $social->avatar,
            'token' => $social->token,
            'token_secret' => property_exists($social, 'tokenSecret') ? $social->tokenSecret : null,
            'data' => json_encode($social->user)
        ];
        $user->social()->create($data);
        return $user;
    }

    /**
     * NeedConfirm action
     * Show message if user must confirm email addresses
     *
     * @param Request $request
     * @param EmailToken $et
     * @return RedirectResponse|View
     */
    public function needConfirm(Request $request, EmailTokenContract $et)
    {
        if ($request->session()->has('need-confirm')) {
            $user = $request->session()->get('user-data');
            if ($request->isMethod('POST')) {
                $request->session()->forget('user-data');
                $request->session()->forget('need-confirm');
                $et->registration($user);
                $toastr = [
                    'type' => 'info',
                    'message' => 'Confirmation link sent to your email',
                    'title' => 'Nice, bro ;)'
                ];
                return redirect()->route('auth::login')->with('toastr', $toastr);
            }
            return view('auth.needConfirm')->with(['name' => $user->getCallName(), 'email' => $user->email]);
        }
        abort(404);
    }

    /**
     * @param User $user
     * @return RedirectResponse
     */
    private function goToNeedConfirm(User $user)
    {
        session(['need-confirm' => true, 'user-data' => $user]);
        return redirect()->route('auth::need.confirm');
    }
}
