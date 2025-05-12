import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { ProfileService } from '../../../../features/profile/services/profile.service';
import { User } from '../../../../features/profile/types/user-profile.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'], // Correct: should be "styleUrls" (plural)
})
export class HeaderComponent implements OnInit {
  user: User | null = null;

  constructor(
    public authService: AuthService,
    private profileService: ProfileService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.profileService.currentUser$.subscribe((user) => {
      this.user = user;
    });

    this.profileService.getProfile().subscribe();
  }

  logout() {
    this.authService.logout().subscribe(
      (res: { message: string }) => {
        this.toastr.success(res.message, 'Success');
        this.router.navigate(['/auth/login']);
      },
      (error: any) => {
        this.toastr.error('Logout failed. Please try again.', 'Error');
        console.error('Logout error:', error);
      }
    );
  }
}
