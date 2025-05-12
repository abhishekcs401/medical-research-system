import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { ProgramService } from '../../../core/services/program.service';
import { Program } from '../../../features/program/types/program.model';

@Component({
  selector: 'app-program-select',
  templateUrl: './program-select.component.html',
})
export class ProgramSelectComponent implements OnInit {
  @Input() selectedProgramId: number | null = null;
  @Output() programSelected = new EventEmitter<number>();

  programs: Program[] = [];
  loading = true;

  constructor(private programService: ProgramService) {}

  ngOnInit(): void {
    this.programService.getAll({ page: 1, limit: 100 }).subscribe({
      next: (response) => {
        this.programs = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        console.error('Failed to load programs');
      },
    });
  }

  onChangeFromModel(value: string): void {
    this.programSelected.emit(+value); // convert back to number
  }
}
