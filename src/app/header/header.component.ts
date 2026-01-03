import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  logout(): void {
    console.log('Logging out user...');
    
    // Clear user session data from localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('googleUser');
    
    console.log('Session cleared');
    console.log('Redirecting to login page');
    
    // Redirect to login page
    this.router.navigate(['/login']);
  }

}
