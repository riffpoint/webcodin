import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  isSubmitted = false;
  loading = false;

  constructor(private fb: FormBuilder, public authService: AuthService) { }

  userForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.userForm.status !== 'INVALID') {
      this.loading = true;

      this.authService.ForgotPassword(this.userForm.controls.email.value)
        .then(() => {
          this.loading = false;
        });
    }
  }
}
