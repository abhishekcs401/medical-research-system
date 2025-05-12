import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantService } from '../../../../core/services/participant.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-participant-edit',
  templateUrl: './participant-edit.component.html',
})
export class ParticipantEditComponent implements OnInit {
  participantForm!: FormGroup;
  submitting = false;
  participantId!: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: ParticipantService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.participantId = +this.route.snapshot.paramMap.get('id')!;
    this.service.getById(this.participantId).subscribe({
      next: (participant) => {
        this.participantForm = this.fb.group({
          name: [participant.name, Validators.required],
          email: [participant.email, [Validators.required, Validators.email]],
          age: [participant.age, [Validators.required, Validators.min(0)]],
          joinedDate: [participant.joinedDate, Validators.required],
          program: [participant.program.id, Validators.required],
        });
      },
      error: () => {
        this.toastr.error('Failed to load participant.');
        this.router.navigate(['/participants']);
      },
    });
  }

  onSubmit(): void {
    if (this.participantForm.invalid) return;
    console.log('Participant data loaded:', this.participantForm.value);
    this.submitting = true;
    this.service
      .update(this.participantId, this.participantForm.value)
      .subscribe({
        next: () => {
          this.toastr.success('Participant updated successfully!');
          this.router.navigate(['/participants']);
        },
        error: () => {
          this.toastr.error('Update failed.');
          this.submitting = false;
        },
      });
  }
}
