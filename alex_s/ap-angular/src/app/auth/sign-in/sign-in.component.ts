import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  isSubmitted = false;
  loading = false;

  constructor(private fb: FormBuilder, public authService: AuthService) { }

  userForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.userForm.status !== 'INVALID') {
      this.loading = true;

      this.authService.SignIn(this.userForm.controls.email.value, this.userForm.controls.password.value)
        .then(() => {
          this.loading = false;
        });
    }
  }
}
