import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthTokenService {
  private readonly tokenKey = 'accessToken'; // Access token only
  private jwtHelper = new JwtHelperService();

  constructor() {}

  // Store Access Token (not refresh token anymore)
  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Retrieve the Access Token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Remove the Access Token
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Validate Access Token
  isTokenValid(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Decode the Access Token
  decodeToken(): any {
    const token = this.getToken();
    return token ? this.jwtHelper.decodeToken(token) : null;
  }

  // Check if the Access Token is expired
  private isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }
}
