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

class MockDatabase {
  private users: Map<string, MockUser> = new Map();
  private idCounter = 1;

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

  clear(): void {
    this.users.clear();
    this.idCounter = 1;
  }
}

export const mockDb = new MockDatabase();
