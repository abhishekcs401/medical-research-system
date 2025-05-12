import { Component, OnInit } from '@angular/core';
import { ProgramService } from '../../../../core/services/program.service';
import { Program, PaginatedResponse } from '../../types/program.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.scss'],
})
export class ProgramListComponent implements OnInit {
  allPrograms: Program[] = []; // <- store all programs fetched
  displayedPrograms: Program[] = []; // <- programs shown after filter + pagination
  isLoading: boolean = true;
  filteredPrograms: Program[] = [];
  errorMessage: string | null = null;
  page: number = 1;
  pageSize: number = 3;
  totalProgramsCount: number = 0; // <- from API or local calculation
  search: string = '';

  constructor(
    private programService: ProgramService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchPrograms();
  }

  fetchPrograms(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.programService
      .getAll({ page: 1, limit: 100 }) // Fetch ALL programs (no pagination at API)
      .subscribe({
        next: (response: PaginatedResponse<Program>) => {
          if ('data' in response) {
            this.allPrograms = response.data;
            this.totalProgramsCount = this.allPrograms.length;
            this.applyFilter(); // filter and paginate after fetch
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Fetch error', error);
          this.errorMessage =
            'Failed to load programs. Please try again later.';
          this.toastr.error(this.errorMessage);
          this.isLoading = false;
        },
      });
  }

  applyFilter(resetPage: boolean = false): void {
    let filtered = this.allPrograms;

    // Apply search filter
    if (this.search) {
      const lowerSearch = this.search.toLowerCase();
      filtered = this.allPrograms.filter(
        (program) =>
          program.title.toLowerCase().includes(lowerSearch) ||
          program.description.toLowerCase().includes(lowerSearch)
      );
    }
    // Update the total programs count (filtered programs)
    this.totalProgramsCount = filtered.length;

    // Reset to page 1 if search changes or resetPage is true
    if (resetPage) {
      this.page = 1;
    }

    // If current page exceeds the total number of pages, reset it to the last valid page
    if (this.page > this.totalPages()) {
      this.page = this.totalPages();
    }

    // Update the displayed programs with the correct pagination
    this.updateDisplayedPrograms(filtered);
  }

  updateDisplayedPrograms(filtered: Program[]): void {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedPrograms = filtered.slice(start, end);
  }

  loadPage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages()) return;
    this.page = newPage;
    this.applyFilter(); // re-apply filter to get correct paginated data
  }

  totalPages(): number {
    return Math.ceil(this.totalProgramsCount / this.pageSize);
  }

  deleteProgram(programId: number): void {
    const confirmDelete = confirm(
      'Are you sure you want to delete this research program?'
    );
    if (confirmDelete) {
      this.isLoading = true;
      this.programService.delete(programId).subscribe({
        next: () => {
          this.allPrograms = this.allPrograms.filter(
            (program) => program.id !== programId
          );
          this.applyFilter(); // refresh after deletion
          this.isLoading = false;
          this.toastr.success('Program deleted successfully!');
        },
        error: (err: any) => {
          console.error('Error deleting program', err);
          this.toastr.error(
            'Failed to delete the research program. Please try again later.'
          );
          this.isLoading = false;
        },
      });
    }
  }
  getProgramTitle(programId: number): string {
    const program = this.allPrograms.find((p) => p.id === programId);
    return program ? program.title : 'No Program';
  }

  pagesArray(): number[] {
    return Array(this.totalPages())
      .fill(0)
      .map((_, i) => i + 1);
  }
}
