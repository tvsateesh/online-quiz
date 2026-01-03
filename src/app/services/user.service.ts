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
    try {
      const googleUserData = localStorage.getItem('googleUser');
      const currentUser = localStorage.getItem('currentUser');

      if (googleUserData) {
        try {
          const userProfile: UserProfile = JSON.parse(googleUserData);
          this.userProfileSubject.next(userProfile);
          console.log('User profile loaded from localStorage:', userProfile);
        } catch (error) {
          console.error('Error parsing user profile from localStorage:', error);
          this.userProfileSubject.next(null);
        }
      } else if (currentUser && currentUser === 'admin') {
        // For traditional admin login, create a basic profile
        const adminProfile: UserProfile = {
          email: 'admin@braingames.com',
          name: 'Admin User',
          picture: 'assets/default-avatar.svg'
        };
        this.userProfileSubject.next(adminProfile);
        console.log('Admin user profile created');
      } else {
        console.log('No user profile found');
        this.userProfileSubject.next(null);
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      this.userProfileSubject.next(null);
    }
  }

  getUserProfile(): UserProfile | null {
    return this.userProfileSubject.value;
  }

  setUserProfile(profile: UserProfile): void {
    this.userProfileSubject.next(profile);
    console.log('User profile set:', profile);
  }

  clearUserProfile(): void {
    this.userProfileSubject.next(null);
    console.log('User profile cleared');
  }
}

