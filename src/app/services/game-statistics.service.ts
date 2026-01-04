import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GameStatistic {
  _id: string;
  userId: string;
  username: string;
  gameName: string;
  score: number;
  time: number;
  difficulty?: string;
  moves?: number;
  result?: string;
  details?: Record<string, any>;
  playedAt: Date;
  createdAt: Date;
}

export interface GameSummary {
  gameName: string;
  totalGames: number;
  totalScore: number;
  wins: number;
  losses: number;
  draws: number;
  totalTime: number;
  recentScore: number;
  avgScore: number;
  winRate: number;
}

export interface UserStats {
  userId: string;
  totalGamesPlayed: number;
  gameStats: GameSummary[];
}

@Injectable({
  providedIn: 'root'
})
export class GameStatisticsService {

  constructor(private http: HttpClient) { }

  /**
   * Save game statistics after a game ends
   */
  saveGameStatistic(data: {
    userId: string;
    username: string;
    gameName: string;
    score: number;
    time: number;
    difficulty?: string;
    moves?: number;
    result?: string;
    details?: Record<string, any>;
  }): Observable<any> {
    return this.http.post('/api/games/statistics', data);
  }

  /**
   * Get all game statistics for a user
   */
  getUserStatistics(userId: string): Observable<{ success: boolean; data: GameStatistic[]; total: number }> {
    return this.http.get<any>(`/api/games/statistics/${userId}`);
  }

  /**
   * Get statistics for a specific game
   */
  getGameStatistics(userId: string, gameName: string): Observable<any> {
    return this.http.get<any>(`/api/games/statistics/${userId}/${gameName}`);
  }

  /**
   * Get summary statistics across all games
   */
  getSummaryStatistics(userId: string): Observable<{ success: boolean; data: UserStats }> {
    return this.http.get<any>(`/api/games/summary/${userId}`);
  }
}
