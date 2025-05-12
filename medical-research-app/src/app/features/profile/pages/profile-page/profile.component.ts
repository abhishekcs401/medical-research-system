import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { User } from '../../types/user-profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Failed to fetch profile', err);
      },
    });
  }
}
