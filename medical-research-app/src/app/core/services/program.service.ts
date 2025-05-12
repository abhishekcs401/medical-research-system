import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';
import {
  Program,
  PaginatedResponse,
} from '../../features/program/types/program.model';

@Injectable({ providedIn: 'root' })
export class ProgramService {
  private readonly baseUrl = `${environment.apiUrl}/programs`;

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: ErrorHandlerService
  ) {}

  /**
   * Fetch all programs with optional pagination and search.
   */
  getAll(options?: {
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<Program>> {
    const params = new HttpParams()
      .set('page', (options?.page ?? 1).toString())
      .set('limit', (options?.limit ?? 5).toString());

    return this.http
      .get<PaginatedResponse<Program>>(this.baseUrl, {
        withCredentials: true,
        params,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching programs:', error);
          this.errorHandler.handleError(error); // Show toast
          return of({
            data: [],
            pagination: { page: 1, limit: 5, total: 0, totalPages: 1 },
          });
        })
      );
  }

  /**
   * Fetch a single program by ID.
   */
  getById(id: number): Observable<Program> {
    return this.http
      .get<Program>(`${this.baseUrl}/${id}`, { withCredentials: true })
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  /**
   * Create a new program (supports FormData for file uploads).
   */
  create(formData: FormData): Observable<Program> {
    return this.http
      .post<Program>(this.baseUrl, formData, { withCredentials: true })
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  /**
   * Update an existing program by ID.
   */
  update(id: number, formData: FormData): Observable<Program> {
    return this.http
      .put<Program>(`${this.baseUrl}/${id}`, formData, {
        withCredentials: true,
      })
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  /**
   * Delete a program by ID.
   */
  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true })
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }
}
