import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth/auth.service';
import { MustMatch } from '../../shared/validators/must-match.validator';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  isSubmitted = false;
  loading = false;

  constructor(private fb: FormBuilder, public authService: AuthService) { }

  userForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    passwordConfirm: ['', Validators.required]
  }, {
    validator: MustMatch('password', 'passwordConfirm')
  });

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.userForm.status !== 'INVALID') {
      this.loading = true;

      this.authService.SignUp(this.userForm.controls.email.value, this.userForm.controls.password.value)
        .then(() => {
          this.loading = false;
        });
    }
  }
}
