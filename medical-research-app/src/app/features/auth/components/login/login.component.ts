import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]],
  });

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.showError('Please fill out the form correctly.');
      return;
    }

    this.isLoading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.handleLoginSuccess(),
      error: (err: any) => this.handleLoginError(err),
    });
  }

  private handleLoginSuccess(): void {
    this.isLoading = false;
    this.showSuccess('Login successful!');
    this.router.navigate(['/dashboard']);
  }

  private handleLoginError(err: any): void {
    this.isLoading = false;

    const errors = err?.error?.errors;
    if (errors && typeof errors === 'object') {
      this.applyServerValidationErrors(errors);
    } else if (err?.error?.message) {
      this.showError(err.error.message);
    } else {
      this.showError('An unexpected error occurred. Please try again.');
    }
  }

  private applyServerValidationErrors(errors: Record<string, string>): void {
    Object.entries(errors).forEach(([field, message]) => {
      const control = this.loginForm.get(field);
      if (control) {
        control.setErrors({ serverError: message });
      }
    });

    // Show a global error message via Toastr, but do not display in the form
    this.showError('There were validation errors. Please review the form.');
  }

  private showSuccess(message: string): void {
    this.toastr.success(message, 'Success', { timeOut: 5000 });
  }

  private showError(message: string): void {
    this.toastr.error(message, 'Error', { timeOut: 5000 });
  }
}
