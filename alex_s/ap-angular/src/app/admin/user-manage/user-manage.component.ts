import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../shared/services/user/user';
import { UserService } from '../../shared/services/user/user.service';
import { GlobalService } from '../../shared/services/global/global.service';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.scss']
})
export class UserManageComponent implements OnInit, OnDestroy {
  title: string;
  submitBtnTitle: string;
  userType: string;

  noImage: string = 'assets/images/site/no-image.svg';
  userImagePreview: string | ArrayBuffer;
  userImage: string | ArrayBuffer = this.noImage;
  userImageFile: File | null;
  userImageDelete: boolean = false;
  userImageOverSize: boolean = false;
  isSubmitted: boolean = false;
  loading: boolean = false;
  user: User;
  currentUserRoles: Array<string> = [];

  currentUserSubscription: any;
  userSubscription: any;
  routeUrlSubscription: any;
  routeParamsSubscription: any;

  alertOptions = {
    autoClose: false,
    keepAfterRouteChange: false
  };

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private globalService: GlobalService
  ) { }

  userForm = this.fb.group({
    avatar: [''],
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    occupation: ['', [Validators.required]],
  })


  ngOnInit(): void {
    this.loading = true;
    const id = JSON.parse(localStorage.getItem('user')).uid;

    this.currentUserSubscription = this.userService.GetUser(id)
      .subscribe((user: User) => {
        this.currentUserRoles = user.roles;

        this.loading = false;
      });

    this.routeUrlSubscription = this.route.url.subscribe(data => {
      this.userType = data[1].path;

      if (this.userType === 'add') {
        this.title = 'Add New User';
        this.submitBtnTitle = 'Create';

        this.fillPost(null);
      } else if (this.userType === 'edit') {
        this.title = 'Edit User';
        this.submitBtnTitle = 'Update';

        this.routeParamsSubscription = this.route.params.subscribe(params => {
          if (params.id) {
            this.userSubscription = this.userService.GetUser(params.id)
              .subscribe((user: User) => {
                this.fillPost(user);
              });
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
    this.routeUrlSubscription.unsubscribe();

    if (this.userType === 'edit') {
      this.routeParamsSubscription.unsubscribe();
      this.userSubscription.unsubscribe();
    }
  }

  uploadPreview(event) {
    this.userImageFile = event.target.files[0];
    this.userImageOverSize = false;
    const size = this.globalService.FormatBytes(this.userImageFile.size);

    if ( (size.type === "Bytes" || size.type === "KB") && size.number < 1024) {
      const reader: FileReader = new FileReader();

      reader.onloadend = () => {
        this.userImagePreview = reader.result;
      }

      reader.readAsDataURL(this.userImageFile);
    } else {
      this.userImageOverSize = true;
      this.userImageFile = null;
      this.userImagePreview = this.noImage;
    }
  }

  clearImage() {
    if (this.user.photoURL) {
      this.userImageDelete = true;
    }

    this.userImageFile = null;
    this.userImagePreview = this.noImage;
  }

  fillPost(user: User): void {
    if (user) {
      this.user = user;

      this.userForm.controls.name.setValue(user.name);
      this.userForm.controls.surname.setValue(user.surname);
      this.userForm.controls.email.setValue(user.email);
      this.userForm.controls.occupation.setValue(user.occupation);
      this.userImage = user.photoURL ? user.photoURL : this.noImage;
    } else {
      this.user = { uid: '', name: '', surname: '', email: '', occupation: '', photoURL: '' };
      this.userImage = this.noImage;
    }
  }

  getPermission() {
    return !this.currentUserRoles.includes('ROLE_SUPER_ADMIN');
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
          if (this.userImageFile) {
            this.globalService.UploadImage(this.userImageFile, this.user.uid, 'avatars', 'users').then(() => {
              this.loading = false;
              this.router.navigate(['admin/users']);
            })
          } else if (this.userImageDelete) {
            this.globalService.DeleteImage(this.user.uid, 'avatars', 'users').then(() => {
              this.loading = false;
              this.userImageDelete = false;
              this.router.navigate(['admin/users']);
            });
          } else {
            this.loading = false;
            this.router.navigate(['admin/users']);
          }
        });
    }
  }
}
