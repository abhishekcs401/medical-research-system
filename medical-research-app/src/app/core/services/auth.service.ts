import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';
import { AuthTokenService } from '../../core/services/auth-token.service';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../../features/auth/types/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private httpOptions = { withCredentials: true };

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private authTokenService: AuthTokenService
  ) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.baseUrl}/auth/login`,
        payload,
        this.httpOptions
      )
      .pipe(
        tap((res: LoginResponse) => {
          if (res?.accessToken) {
            this.authTokenService.storeToken(res.accessToken);
          }
        }),
        catchError((error: HttpErrorResponse) =>
          this.errorHandler.handleError(error)
        )
      );
  }

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${this.baseUrl}/auth/register`, payload)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.errorHandler.handleError(error)
        )
      );
  }

  logout(): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(
        `${this.baseUrl}/auth/logout`,
        {},
        this.httpOptions
      )
      .pipe(
        tap(() => {
          this.authTokenService.removeToken();
          // You may also want to clear sessionStorage/localStorage or redirect
        }),
        catchError((error: HttpErrorResponse) =>
          this.errorHandler.handleError(error)
        )
      );
  }

  isLoggedIn(): boolean {
    return this.authTokenService.isTokenValid();
  }

  decodeToken(): any {
    return this.authTokenService.decodeToken();
  }

  refreshToken(): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.baseUrl}/auth/refresh-token`,
        {},
        this.httpOptions
      )
      .pipe(
        tap((response) => {
          if (response?.accessToken) {
            this.authTokenService.storeToken(response.accessToken);
          }
        }),
        catchError((error: HttpErrorResponse) =>
          this.errorHandler.handleError(error)
        )
      );
  }
}
