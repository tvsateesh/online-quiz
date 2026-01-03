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
    // Check initial route
    this.checkActiveRoute();
    
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkActiveRoute();
    });
  }

  private checkActiveRoute(): void {
    this.activeChildRoute = this.router.url.includes('/games/');
  }

  hasActiveRoute(): boolean {
    return this.activeChildRoute;
  }

}
