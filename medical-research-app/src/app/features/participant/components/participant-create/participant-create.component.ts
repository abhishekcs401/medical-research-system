import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ParticipantService } from '../../../../core/services/participant.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-participant-create',
  templateUrl: './participant-create.component.html',
})
export class ParticipantCreateComponent {
  participantForm: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private participantService: ParticipantService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.participantForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: [null, [Validators.required, Validators.min(0)]],
      joinedDate: ['', Validators.required],
      program: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.participantForm.invalid) return;

    this.submitting = true;
    this.participantService.create(this.participantForm.value).subscribe({
      next: () => {
        this.toastr.success('Participant created successfully!');
        this.router.navigate(['/participants']);
      },
      error: () => {
        this.toastr.error('Failed to create participant.');
        this.submitting = false;
      },
    });
  }
}
