import { Component, OnInit, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GameStatisticsService, UserStats } from 'src/app/services/game-statistics.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  private activeChildRoute = false;
  userStats: UserStats | null = null;
  showStatsPanel: boolean = false;
  currentUser: any = null;

  constructor(private router: Router, private ngZone: NgZone, private gameStatsService: GameStatisticsService) { }

  ngOnInit(): void {
    console.log('GamesComponent initialized');
    console.log('Current URL:', this.router.url);
    
    // Load user stats
    this.loadUserStats();
    
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

  loadUserStats(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        this.currentUser = JSON.parse(userStr);
        if (this.currentUser.id) {
          this.gameStatsService.getSummaryStatistics(this.currentUser.id).subscribe(
            (response) => {
              if (response.success) {
                this.userStats = response.data;
                console.log('User stats loaded:', this.userStats);
              }
            },
            (error) => {
              console.error('Error loading user stats:', error);
            }
          );
        }
      } catch (e) {
        console.error('Error parsing current user:', e);
      }
    }
  }

  toggleStatsPanel(): void {
    this.showStatsPanel = !this.showStatsPanel;
  }

  private checkActiveRoute(): void {
    this.activeChildRoute = this.router.url.includes('/games/');
    console.log('Active child route:', this.activeChildRoute, 'URL:', this.router.url);
  }

  hasActiveRoute(): boolean {
    return this.activeChildRoute;
  }

  onMenuItemClick(route: string): void {
    console.log('Menu item clicked:', route);
    this.ngZone.run(() => {
      this.router.navigate(['/games', route]).then(
        success => console.log('Navigation success:', success, 'to route:', route),
        error => console.error('Navigation error:', error)
      );
    });
  }

}
