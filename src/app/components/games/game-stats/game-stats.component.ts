import { Component, OnInit, Input } from '@angular/core';
import { GameStatisticsService, UserStats } from '../../../services/game-statistics.service';

@Component({
  selector: 'app-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.scss']
})
export class GameStatsComponent implements OnInit {

  @Input() userId: string | null = null;
  @Input() showStatsDropdown: boolean = false;

  stats: UserStats | null = null;
  loading: boolean = false;
  errorMsg: string = '';

  constructor(private gameStatsService: GameStatisticsService) { }

  ngOnInit(): void {
    if (this.userId) {
      this.loadStatistics();
    }
  }

  loadStatistics(): void {
    if (!this.userId) return;

    this.loading = true;
    this.errorMsg = '';

    this.gameStatsService.getSummaryStatistics(this.userId).subscribe(
      (response) => {
        if (response.success) {
          this.stats = response.data;
        } else {
          this.errorMsg = 'Failed to load statistics';
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error loading statistics:', error);
        this.errorMsg = 'Error loading statistics. Please try again.';
        this.loading = false;
      }
    );
  }

  formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  }

  closeStats(): void {
    this.showStatsDropdown = false;
  }

  refresh(): void {
    this.loadStatistics();
  }

}
