import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user/user.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { GlobalService } from '../../shared/services/global/global.service';
import { MustMatch } from '../../shared/validators/must-match.validator';

import { User } from "../../shared/services/user/user";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  noImage: string = 'assets/images/site/no-image.svg';
  userAvatarPreview: string | ArrayBuffer;
  userAvatar: string | ArrayBuffer = this.noImage;
  userAvatarFile: File | null;
  userAvatarDelete: boolean = false;
  isSubmitted: boolean = false;
  loading: boolean = false;
  usersSubscription: any;
  user: User;
  userId: string = '';
  tabState: string = 'GeneralInformation';
  passwordOld: string;
  password: string;
  passwordConfirm: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public authService: AuthService,
    private globalService: GlobalService
  ) { }

  userForm = this.fb.group({
    avatar: [''],
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    occupation: ['', [Validators.required]],
  })

  userChangePasswordForm = this.fb.group({
    passwordOld: ['', Validators.required],
    password: ['', Validators.required],
    passwordConfirm: ['', Validators.required]
  }, {
    validator: MustMatch('password', 'passwordConfirm')
  })

  ngOnInit(): void {
    this.loading = true;
    const id = JSON.parse(localStorage.getItem('user')).uid;

    this.usersSubscription = this.userService.GetUser(id)
      .subscribe((user: User) => {
        this.user = user;
        this.userForm.controls.name.setValue(user.name);
        this.userForm.controls.surname.setValue(user.surname);
        this.userForm.controls.email.setValue(user.email);
        this.userForm.controls.occupation.setValue(user.occupation);
        this.userId = user.uid;

        this.userAvatar = user.photoURL ? user.photoURL : this.noImage;

        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }

  uploadPreview(event) {
    this.userAvatarFile = event.target.files[0];

    const reader: FileReader = new FileReader();

    reader.onloadend = () => {
      this.userAvatarPreview = reader.result;
    }

    reader.readAsDataURL(this.userAvatarFile);
  }

  clearAvatar() {
    if (this.user.photoURL) {
      this.userAvatarDelete = true;
    }

    this.userAvatarFile = null;
    this.userAvatarPreview = this.noImage;
  }

  switchTab(event: any, tabName: string) {
    event.stopPropagation();
    event.preventDefault();

    this.tabState = tabName;
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.userForm.status !== "INVALID") {
      this.loading = true;

      this.user.name = this.userForm.controls.name.value;
      this.user.surname = this.userForm.controls.surname.value;
      this.user.occupation = this.userForm.controls.occupation.value;

      this.userService.SetUserData(this.user)
        .then(() => {
          if (this.userAvatarFile) {
            this.globalService.UploadImage(this.userAvatarFile, this.user.uid, 'avatars', 'users').then(() => {
              this.loading = false;
            })
          } else if (this.userAvatarDelete) {
            this.globalService.DeleteImage(this.user.uid, 'avatars', 'users').then(() => {
              this.loading = false;
              this.userAvatarDelete = false;
            });
          } else {
            this.loading = false;
          }
        });
    }
  }

  onChangePassword() {
    this.isSubmitted = true;

    if (this.userChangePasswordForm.status !== "INVALID") {
      this.loading = true;

      this.passwordOld = this.userChangePasswordForm.controls.passwordOld.value;
      this.password = this.userChangePasswordForm.controls.password.value;
      this.passwordConfirm = this.userChangePasswordForm.controls.passwordConfirm.value;

      console.log(this.passwordOld);
      console.log(this.password);
      console.log(this.passwordConfirm);

      this.authService.ChangePassword(this.passwordOld, this.user.email, this.password)
        .then(() => {
          this.loading = false;
        });
    }
  }
}
