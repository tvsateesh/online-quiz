// Mock MongoDB implementation for testing without a real database
// Replace this with real MongoDB when available

import bcryptjs from 'bcryptjs';

export interface MockUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

export interface MockGameStatistic {
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

class MockDatabase {
  private users: Map<string, MockUser> = new Map();
  private gameStats: Map<string, MockGameStatistic> = new Map();
  private idCounter = 1;
  private statsIdCounter = 1;

  async findOne(query: any): Promise<MockUser | null> {
    const users = Array.from(this.users.values());
    
    if (query.email) {
      return users.find(u => u.email === query.email) || null;
    }
    
    if (query.$or) {
      return users.find(u => 
        query.$or.some((condition: any) => {
          if (condition.email) return u.email === condition.email;
          if (condition.username) return u.username === condition.username;
          return false;
        })
      ) || null;
    }
    
    return null;
  }

  async save(user: Partial<MockUser>): Promise<MockUser> {
    const id = `mock_id_${this.idCounter++}`;
    const now = new Date();
    
    const fullUser: MockUser = {
      _id: id,
      username: user.username || '',
      email: user.email || '',
      password: user.password || '',
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: now,
      updatedAt: now,
      comparePassword: async function(password: string): Promise<boolean> {
        return await bcryptjs.compare(password, this.password);
      }
    };

    this.users.set(id, fullUser);
    return fullUser;
  }

  // Game Statistics Methods
  async saveGameStatistic(data: Partial<MockGameStatistic>): Promise<MockGameStatistic> {
    const id = `mock_stat_${this.statsIdCounter++}`;
    const now = new Date();
    
    const stat: MockGameStatistic = {
      _id: id,
      userId: data.userId || '',
      username: data.username || '',
      gameName: data.gameName || '',
      score: data.score || 0,
      time: data.time || 0,
      difficulty: data.difficulty || 'medium',
      moves: data.moves || 0,
      result: data.result || 'draw',
      details: data.details || {},
      playedAt: data.playedAt || now,
      createdAt: now
    };

    this.gameStats.set(id, stat);
    return stat;
  }

  async getGameStatistics(userId: string): Promise<MockGameStatistic[]> {
    const stats = Array.from(this.gameStats.values());
    return stats
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime());
  }

  async getGameStatisticsByGame(userId: string, gameName: string): Promise<MockGameStatistic[]> {
    const stats = Array.from(this.gameStats.values());
    return stats
      .filter(s => s.userId === userId && s.gameName === gameName)
      .sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime());
  }

  clear(): void {
    this.users.clear();
    this.gameStats.clear();
    this.idCounter = 1;
    this.statsIdCounter = 1;
  }
}

export const mockDb = new MockDatabase();
