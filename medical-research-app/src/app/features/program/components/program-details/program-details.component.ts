import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProgramService } from '../../../../core/services/program.service';
import { Program } from '../../types/program.model';

@Component({
  selector: 'app-program-details',
  templateUrl: './program-details.component.html',
})
export class ProgramDetailsComponent implements OnInit {
  programId!: number;
  program!: Program;

  constructor(
    private route: ActivatedRoute,
    private programService: ProgramService
  ) {}

  ngOnInit(): void {
    this.programId = +this.route.snapshot.paramMap.get('id')!;
    this.programService.getById(this.programId).subscribe({
      next: (program) => {
        this.program = program;
      },
      error: (err) => {
        console.error('Error fetching program:', err);
      },
    });
  }

  getAttachmentUrl(fileName: string): string {
    // Replace with your actual backend base URL if different
    return `http://localhost:4000/api/programs/uploads/${fileName}`;
  }
}
