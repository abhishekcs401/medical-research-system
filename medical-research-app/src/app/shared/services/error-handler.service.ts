import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private toastr: ToastrService) {}

  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred.';

    if (error.status === 0) {
      errorMessage =
        'Network error occurred. Please check your internet connection.';
    } else if (
      error.status === 400 ||
      error.status === 401 ||
      error.status === 403
    ) {
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else {
        errorMessage = 'Invalid request. Please check your input.';
      }

      if (error.status === 401) {
        errorMessage = 'Unauthorized. Please log in.';
        // Optional: trigger logout or redirect
      } else if (error.status === 403) {
        errorMessage =
          'Forbidden. You don’t have permission to perform this action.';
      }
    } else if (error.status === 404) {
      errorMessage = 'Not Found. The requested resource doesn’t exist.';
    } else if (error.status === 500) {
      errorMessage = 'Server error occurred. Please try again later.';
    }

    // Dev logging only
    if (!environment.production) {
      console.error('HTTP Error:', error);
    }

    this.toastr.error(errorMessage, 'Error', { timeOut: 5000 });

    return throwError(() => new Error(errorMessage));
  }
}
