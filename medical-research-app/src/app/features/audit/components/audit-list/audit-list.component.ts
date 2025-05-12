import { Component, OnInit } from '@angular/core';
import { AuditService } from '../../../../core/services/audit.service';
import { Audit, AuditResponse } from '../../../audit/types/audit.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-audit-list',
  templateUrl: './audit-list.component.html',
  styleUrls: ['./audit-list.component.scss'],
})
export class AuditListComponent implements OnInit {
  audits: Audit[] = [];
  filteredAudits: Audit[] = [];
  paginated: Audit[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalAudits: number = 0;
  loading: boolean = true;
  search: string = '';

  constructor(
    private auditService: AuditService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAudits();
  }

  loadAudits(): void {
    this.loading = true;
    this.auditService
      .getAll({ page: 1, limit: 1000 }) // Load all data for client-side pagination/filter
      .subscribe({
        next: (response: AuditResponse) => {
          this.audits = response.data || [];
          this.totalAudits = this.audits.length;
          this.filteredAudits = [...this.audits];
          this.paginate();
        },
        error: (err) => {
          this.toastr.error('Failed to load audit data.');
          console.error(err);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  applyFilter(): void {
    const keyword = this.search.toLowerCase();
    this.filteredAudits = this.audits.filter((audit) => {
      const display = this.getDisplayName(audit).toLowerCase();
      const email = (audit.payload?.data as any).email?.toLowerCase() || '';
      return display.includes(keyword) || email.includes(keyword);
    });

    this.currentPage = 1;
    this.paginate();
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = this.currentPage * this.pageSize;
    this.paginated = this.filteredAudits.slice(start, end);
  }

  loadPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginate();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredAudits.length / this.pageSize);
  }

  pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getDisplayName(audit: Audit): string {
    const data = audit.payload?.data as any;
    return data?.name || data?.title || 'N/A';
  }

  getDisplayDate(audit: Audit): string | null {
    const data = audit.payload?.data as any;
    return data?.joinedDate || data?.startDate || null;
  }

  getAuditField(audit: Audit, field: string): string {
    const data = audit.payload?.data as any;
    return data?.[field] || 'N/A';
  }
}
