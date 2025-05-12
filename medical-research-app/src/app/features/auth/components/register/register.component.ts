import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    username: ['', [Validators.required]],
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
    if (this.registerForm.invalid) {
      this.showError('Please fill out the form correctly.');
      return;
    }

    this.isLoading = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: () => this.handleRegisterSuccess(),
      error: (err) => this.handleRegisterError(err),
    });
  }

  private handleRegisterSuccess(): void {
    this.isLoading = false;
    this.showSuccess('Registration successful! You can now log in.');
    this.router.navigate(['/login']);
  }

  private handleRegisterError(err: any): void {
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
      const control = this.registerForm.get(field);
      if (control) {
        control.setErrors({ serverError: message });
      }
    });

    this.showError('There were validation errors. Please review the form.');
  }

  private showSuccess(message: string): void {
    this.toastr.success(message, 'Success', { timeOut: 5000 });
  }

  private showError(message: string): void {
    this.toastr.error(message, 'Error', { timeOut: 5000 });
  }
}
