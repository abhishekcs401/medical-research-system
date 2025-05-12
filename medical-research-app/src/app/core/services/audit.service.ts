import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Audit, AuditResponse } from '../../features/audit/types/audit.model';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly baseUrl = `${environment.apiUrl}/audits`;

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: ErrorHandlerService
  ) {}

  /**
   * Fetch all audits with optional pagination.
   * @param options Optional parameters for pagination (page, limit).
   */
  getAll(
    options: { page?: number; limit?: number } = {}
  ): Observable<AuditResponse> {
    // Set default pagination values if not provided
    const params = new HttpParams()
      .set('page', (options.page ?? 1).toString())
      .set('limit', (options.limit ?? 5).toString());

    return this.http
      .get<AuditResponse>(this.baseUrl, { params, withCredentials: true })
      .pipe(
        catchError((error) => {
          // Handle error gracefully and log to console
          console.error('Error fetching audits:', error);
          // Fallback value in case of error
          return of({
            data: [],
            pagination: { page: 1, limit: 5, total: 0, totalPages: 1 },
          });
        })
      );
  }

  /**
   * Fetch a single audit by ID.
   * @param id The ID of the audit to fetch.
   */
  getById(id: number): Observable<Audit> {
    return this.http
      .get<Audit>(`${this.baseUrl}/${id}`, { withCredentials: true })
      .pipe(catchError(this.errorHandler.handleError));
  }
}
