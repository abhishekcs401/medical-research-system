import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramService } from '../../../../core/services/program.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Program } from '../../types/program.model';

@Component({
  selector: 'app-program-edit',
  templateUrl: './program-edit.component.html',
  styleUrls: ['./program-edit.component.scss'],
})
export class ProgramEditComponent implements OnInit {
  programForm!: FormGroup;
  programId!: number;
  submitting = false;
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private programService: ProgramService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || isNaN(+idParam)) {
      this.toastr.error('Invalid program ID.', 'Error');
      this.router.navigate(['/programs']);
      return;
    }

    this.programId = +idParam;

    this.programService.getById(this.programId).subscribe({
      next: (program: Program) => {
        this.programForm = this.fb.group({
          title: [
            program.title,
            [Validators.required, Validators.maxLength(100)],
          ],
          description: [program.description ?? '', Validators.maxLength(500)],
          startDate: [program.startDate, Validators.required],
          endDate: [program.endDate, Validators.required],
          budget: [program.budget, [Validators.required, Validators.min(0)]],
          attachment: [program.attachment ?? ''],
        });
      },
      error: () => {
        this.toastr.error('Failed to fetch program details.', 'Error');
        this.router.navigate(['/programs']);
      },
    });
  }

  // Unified file selection handler
  onFileSelected(file: File): void {
    if (!file) return;
    this.selectedFile = file;
    this.programForm.patchValue({ attachment: file.name });
    console.log('File selected:', file.name);
  }

  onSubmit(): void {
    if (this.programForm.invalid) {
      this.toastr.warning(
        'Please complete all required fields.',
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

    this.programService.update(this.programId, formData).subscribe({
      next: () => {
        this.toastr.success('Program updated successfully.', 'Success');
        this.router.navigate(['/programs']);
      },
      error: (error) => {
        console.error('Update error:', error);
        this.toastr.error(
          'Failed to update program. Please try again.',
          'Error'
        );
        this.submitting = false;
      },
    });
  }

  private buildFormData(): FormData {
    const formData = new FormData();

    Object.keys(this.programForm.controls).forEach((key) => {
      if (key === 'attachment') return; // skip UI-only field
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
