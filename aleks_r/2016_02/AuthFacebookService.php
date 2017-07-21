<?php
/**
 * Class AuthFacebookService
 *
 * @author WebCodin <info@webcodin.com>
 * @package UserModule\Service
 */
namespace UserModule\Service;

use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use Zend\Mvc\Controller\Plugin\Redirect;
use Zend\Http\Client as HttpClient;

class AuthFacebookService implements ServiceLocatorAwareInterface, SocialAuthServiceInterface
{
    protected $serviceLocator;
    protected $plugins;
    
    /**
     * Set service locator
     * @param ServiceLocatorInterface $serviceLocator
     */
    public function setServiceLocator(ServiceLocatorInterface $serviceLocator)
    {
        $this->serviceLocator = $serviceLocator;
    }
 
    /**
     * Get service locator
     * @return ServiceLocatorInterface
     */
    public function getServiceLocator()
    {
        return $this->serviceLocator;
    }
    
    /**
     * Auth user with Facebook
     *
     * @return Redirect
     */
    public function auth()
    {
        $plugins = $this->serviceLocator->get('ControllerPluginManager');
        $this->plugins = $plugins;
        $params = $plugins->get('Params');
        $query = $params->fromQuery();
        $isCallback = boolval($params->fromRoute('callback'));
        $state = $plugins->get('Url')->fromRoute('backend/auth');
        $redirectUrl = $plugins->get('Url')->fromRoute(
            'backend/auth.social',
            array(
            'provider' => 'facebook',
            'callback' => 'callback'
            ),
            array('force_canonical' => true)
        );
        if (!$isCallback) {
            return $this->goToAuth($redirectUrl, $state);
        }
        if (isset($query['error'])) {
            return $this->ifQueryError($query);
        }
        if (isset($query['code'])) {
            return $this->ifQueryCode($query, $state, $redirectUrl);
        }
        $plugins->get('FlashMessenger')->addErrorMessage('Try again');
        return $plugins->get('Redirect')->toRoute('backend/auth.login');
    }
    
    /**
     * Generate url to request
     *
     * @param string $type
     * @param array $addParams
     * @return string
     */
    private function generateUrl($type, $addParams = array())
    {
        $config = $this->serviceLocator->get('Config');
        $fb = $config['oauth']['facebook'];
        switch ($type) {
            case 'code':
                $params = [
                    'client_id' => $fb['client_id'],
                    'response_type' => 'code granted_scopes',
                    'scope' => $fb['scope'],
                ];
                break;
            case 'token':
                $params = [
                    'client_id' => $fb['client_id'],
                    'client_secret' => $fb['client_secret'],
                ];
                break;
            case 'api':
                $params = [
                    'fields' => $fb['fields'],
                ];
                break;
            default:
                $params = array();
                break;
        }
        $query_array = array_merge($params, $addParams);
        $url = $fb[$type . '_url'] . '?'. http_build_query($query_array);
        return $url;
    }
    
    /**
     * Get client for request
     *
     * @param string $url
     * @return HttpClient
     */
    private function getHttpClient($url)
    {
        $cfg = array(
                'adapter'   => 'Zend\Http\Client\Adapter\Curl',
                'curloptions' => array(CURLOPT_FOLLOWLOCATION => true),
            );
        $client = new HttpClient();
        $client->setOptions($cfg);
        $client->setUri($url);
        return $client;
    }

    /**
     * Go to facebook confirm window
     *
     * @param string $redirectUrl
     * @param string $state
     * @return Redirect
     */
    private function goToAuth($redirectUrl, $state)
    {
        $addParams = array(
            'redirect_uri' => $redirectUrl . '#delete_me_with_js',
            'state' => $state
        );
        $url = $this->generateUrl('code', $addParams);
        return $this->plugins->get('Redirect')->toUrl($url);
    }

    /**
     * Process error response
     *
     * @param array $query
     * @return Redirect
     */
    private function ifQueryError($query)
    {
        if ($query['error'] == 'access_denied') {
            $message = "You canceled the authorization";
        } else {
            $message = "Unknown error. Try later.";
        }
        $this->plugins->get('FlashMessenger')->addErrorMessage($message);
        return $this->plugins->get('Redirect')->toRoute('backend/auth.login');
    }

    /**
     * Get token and user info.
     * Register user
     *
     * @param array $query
     * @param string $profileUrl
     * @param string $redirectUrl
     * @return Redirect
     */
    private function ifQueryCode($query, $profileUrl, $redirectUrl)
    {
        if ($query['denied_scopes'] == 'email') {
            /**
             * @todo What do if user denied email scope on this step?
             */
        }

        $afterLoginUrl = $profileUrl;
        $addParams = array(
            'redirect_uri' => $redirectUrl . '#delete_me_with_js',
            'code' => $query['code']
        );
        $url = $this->generateUrl('token', $addParams);
        $client = $this->getHttpClient($url);
        $response = $client->send();

        if ($response->isSuccess()) {
            $tokenObj = json_decode($response->getBody());
            $token = $tokenObj->access_token;
            $addParams = array('access_token' => $token);
            $url = $this->generateUrl('api', $addParams);
            $client->setUri($url);
            $response = $client->send();

            if ($response->isSuccess()) {
                $providerData = json_decode($response->getBody(), true);
                $providerData['token'] = $token;
                $userData['provider_id'] = $providerData['id'];
                $userData['name'] = $providerData['name'];
                $userData['picture'] = $providerData['picture'];
                $userData['isFakeEmail'] = false;
                if (isset($providerData['email'])) {
                    $userData['email'] = $providerData['email'];
                } else {
                    $providerData['email'] = null;
                    $userData['email'] = $providerData['id'] . '@facebook.com';
                    $userData['isFakeEmail'] = true;
                }
                $userData['provider'] = $providerData;
                return $this->serviceLocator->get('StoreSocialUser')
                    ->process('Facebook', $userData, $afterLoginUrl);
            } else {
                $this->plugins->get('FlashMessenger')->addErrorMessage($response->getReasonPhrase());
                return $this->plugins->get('Redirect')
                    ->toRoute('backend/auth.login');
            }
        } else {
            $this->plugins->get('FlashMessenger')->addErrorMessage($response->getReasonPhrase());
            return $this->plugins->get('Redirect')->toRoute('backend/auth.login');
        }
    }
}
