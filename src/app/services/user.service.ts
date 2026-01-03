import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserProfile {
  email: string;
  name: string;
  picture: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  public userProfile$: Observable<UserProfile | null> = this.userProfileSubject.asObservable();

  constructor() {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const googleUserData = localStorage.getItem('googleUser');
    const currentUser = localStorage.getItem('currentUser');

    if (googleUserData) {
      try {
        const userProfile: UserProfile = JSON.parse(googleUserData);
        this.userProfileSubject.next(userProfile);
        console.log('User profile loaded:', userProfile);
      } catch (error) {
        console.error('Error parsing user profile:', error);
      }
    } else if (currentUser && currentUser === 'admin') {
      // For traditional admin login, create a basic profile
      const adminProfile: UserProfile = {
        email: 'admin@braingames.com',
        name: 'Admin User',
        picture: 'assets/default-avatar.svg'
      };
      this.userProfileSubject.next(adminProfile);
    }
  }

  getUserProfile(): UserProfile | null {
    return this.userProfileSubject.value;
  }

  clearUserProfile(): void {
    this.userProfileSubject.next(null);
  }
}
