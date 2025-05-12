import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Participant,
  ParticipantResponse,
} from '../../features/participant/types/participant.model';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';

@Injectable({ providedIn: 'root' })
export class ParticipantService {
  private readonly baseUrl = `${environment.apiUrl}/participants`;

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: ErrorHandlerService
  ) {}

  /**
   * Fetch all participants with optional pagination.
   */
  getAll(options?: {
    page?: number;
    limit?: number;
  }): Observable<ParticipantResponse> {
    const params = new HttpParams()
      .set('page', (options?.page ?? 1).toString())
      .set('limit', (options?.limit ?? 5).toString());

    return this.http
      .get<ParticipantResponse>(this.baseUrl, {
        params,
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching participants:', error);
          this.errorHandler.handleError(error); // show toast
          return of({
            data: [],
            pagination: { page: 1, limit: 5, total: 0, totalPages: 1 },
          });
        })
      );
  }

  /**
   * Fetch a single participant by ID.
   */
  getById(id: number): Observable<Participant> {
    return this.http
      .get<Participant>(`${this.baseUrl}/${id}`, { withCredentials: true })
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  /**
   * Create a new participant.
   */
  create(data: Partial<Participant>): Observable<Participant> {
    return this.http
      .post<Participant>(this.baseUrl, data, { withCredentials: true })
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  /**
   * Update an existing participant by ID.
   */
  update(id: number, data: Partial<Participant>): Observable<Participant> {
    return this.http
      .put<Participant>(`${this.baseUrl}/${id}`, data, {
        withCredentials: true,
      })
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  /**
   * Delete a participant by ID.
   */
  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true })
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }
}
