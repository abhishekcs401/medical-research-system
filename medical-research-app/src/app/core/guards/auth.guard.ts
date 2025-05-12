import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthTokenService } from '../../core/services/auth-token.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authTokenService: AuthTokenService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    const token = this.authTokenService.getToken();
    if (token) {
      return of(true); // The user is authenticated
    }

    this.router.navigate(['/auth/login']);
    return of(false); // The user is not authenticated
  }
}
