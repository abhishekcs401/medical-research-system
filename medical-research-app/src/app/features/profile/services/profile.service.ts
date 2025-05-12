import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../types/user-profile.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private baseUrl = environment.apiUrl;
  private httpOptions = { withCredentials: true };

  // Create a private BehaviorSubject to hold the user data
  private currentUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);

  // Public Observable for other components to subscribe to
  public currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  // Fetch the profile data and update the BehaviorSubject
  getProfile(): Observable<User> {
    return this.http
      .get<User>(`${this.baseUrl}/auth/me`, this.httpOptions)
      .pipe(
        tap((user) => {
          this.setUser(user); // Set the user when fetched
        }),
        catchError((err) => {
          console.error('Failed to fetch profile', err);
          throw err;
        })
      );
  }

  // Update the profile and return the updated data
  updateProfile(data: User): Observable<User> {
    return this.http.put<User>('/update-profile', data);
  }

  // Set the user data in the BehaviorSubject
  setUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  // Get the current user data
  getUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Optional: You can also create a method to clear the user (e.g., for logout)
  clearUser(): void {
    this.currentUserSubject.next(null);
  }
}
