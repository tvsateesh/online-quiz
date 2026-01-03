import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userProfile$: Observable<any>;

  constructor(private router: Router, private userService: UserService) {
    this.userProfile$ = this.userService.userProfile$;
  }

  ngOnInit(): void {
  }

  logout(): void {
    console.log('Logging out user...');
    
    // Clear user session data from localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('googleUser');
    
    // Clear user profile from service
    this.userService.clearUserProfile();
    
    console.log('Session cleared');
    console.log('Redirecting to login page');
    
    // Redirect to login page
    this.router.navigate(['/login']);
  }

}
