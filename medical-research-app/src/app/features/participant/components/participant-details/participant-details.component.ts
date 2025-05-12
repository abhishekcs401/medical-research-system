import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParticipantService } from '../../../../core/services/participant.service';
import { Participant } from '../../types/participant.model';

@Component({
  selector: 'app-participant-details',
  templateUrl: './participant-details.component.html',
})
export class ParticipantDetailsComponent implements OnInit {
  participant?: Participant;

  constructor(
    private route: ActivatedRoute,
    private service: ParticipantService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.service.getById(id).subscribe((p) => (this.participant = p));
  }
}
