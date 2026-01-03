import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  private activeChildRoute = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log('GamesComponent initialized');
    console.log('Current URL:', this.router.url);
    
    // Check initial route
    this.checkActiveRoute();
    
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      console.log('Navigation ended to:', event.urlAfterRedirects);
      this.checkActiveRoute();
    });
  }

  private checkActiveRoute(): void {
    this.activeChildRoute = this.router.url.includes('/games/');
    console.log('Active child route:', this.activeChildRoute, 'URL:', this.router.url);
  }

  hasActiveRoute(): boolean {
    return this.activeChildRoute;
  }

}
