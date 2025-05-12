import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProgramService } from '../../../../core/services/program.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-program-create',
  templateUrl: './program-create.component.html',
  styleUrls: ['./program-create.component.scss'],
})
export class ProgramCreateComponent {
  programForm: FormGroup;
  selectedFile: File | null = null;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private programService: ProgramService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.programForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      budget: [0, [Validators.required, Validators.min(0)]],
      attachment: [''], // For UI display purposes only
    });
  }

  // Handle file selection emitted from child component
  onFileSelected(file: File): void {
    if (!file) return;

    this.selectedFile = file;
    this.programForm.patchValue({ attachment: file.name });

    console.log('File selected:', file.name);
  }

  // Form submission handler
  onSubmit(): void {
    if (this.programForm.invalid) {
      this.toastr.warning(
        'Please fill out all required fields correctly.',
        'Validation Error'
      );
      return;
    }

    const startDate = new Date(this.programForm.get('startDate')?.value);
    const endDate = new Date(this.programForm.get('endDate')?.value);

    if (startDate > endDate) {
      this.toastr.warning(
        'Start date must be before end date.',
        'Date Validation Error'
      );
      return;
    }

    const formData = this.buildFormData();
    this.submitting = true;

    this.programService.create(formData).subscribe({
      next: () => {
        this.toastr.success('Program created successfully!', 'Success');
        this.router.navigate(['/programs']);
      },
      error: (err) => {
        this.toastr.error(
          'Failed to create program. Please try again.',
          'Error'
        );
        console.error('Create failed:', err);
        this.submitting = false;
      },
    });
  }

  // Build FormData object for submission
  private buildFormData(): FormData {
    const formData = new FormData();

    Object.keys(this.programForm.controls).forEach((key) => {
      if (key === 'attachment') return; // Exclude fake UI-only attachment field

      const value = this.programForm.get(key)?.value;
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (this.selectedFile) {
      formData.append('attachment', this.selectedFile);
    }

    return formData;
  }
}
