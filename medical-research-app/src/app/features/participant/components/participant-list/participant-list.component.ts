import { Component, OnInit } from '@angular/core';
import { ParticipantService } from '../../../../core/services/participant.service';
import { ProgramService } from '../../../../core/services/program.service';
import { Program } from '../../../program/types/program.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.scss'],
})
export class ParticipantListComponent implements OnInit {
  participants: any[] = [];
  paginated: any[] = [];
  currentPage: number = 1;
  pageSize: number = 3;
  totalParticipants: number = 0;
  loading: boolean = true;
  search: string = '';
  programs: { [id: number]: Program } = {};

  constructor(
    private participantService: ParticipantService,
    private programService: ProgramService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadParticipants();
  }

  loadParticipants() {
    this.loading = true;
    this.participantService
      .getAll({ page: this.currentPage, limit: this.pageSize })
      .subscribe((response: any) => {
        this.participants = response.data || [];
        this.totalParticipants = response.pagination.total || 0;
        this.applyFilter();
        this.loadPrograms();
        this.loading = false;
      });
  }

  loadPrograms(): void {
    const programIds = [
      ...new Set(
        this.participants
          .map((p) => p.program?.id)
          .filter((id): id is number => typeof id === 'number')
      ),
    ];

    programIds.forEach((id) => {
      this.programService.getById(id).subscribe((program: Program) => {
        this.programs[id] = program;
      });
    });
  }
  applyFilter() {
    if (this.search) {
      this.paginated = this.participants.filter(
        (p) =>
          p.name.toLowerCase().includes(this.search.toLowerCase()) ||
          p.email.toLowerCase().includes(this.search.toLowerCase())
      );
    } else {
      this.paginated = this.participants;
    }
  }

  loadPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
      this.loadParticipants();
    }
  }

  totalPages(): number {
    return Math.ceil(this.totalParticipants / this.pageSize);
  }

  deleteParticipant(id: number): void {
    const confirmDelete = confirm(
      'Are you sure you want to delete this participant?'
    );
    if (confirmDelete) {
      this.loading = true;
      this.participantService.delete(id).subscribe({
        next: () => {
          this.toastr.success('Participant deleted successfully');
          this.loadParticipants();
        },
        error: () => {
          this.toastr.error('Error deleting participant');
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }

  pagesArray(): number[] {
    return Array(this.totalPages())
      .fill(0)
      .map((_, i) => i + 1);
  }

  getProgramTitle(programId: number): string {
    const program = this.programs[programId];
    return program ? program.title : 'No Program';
  }
}
