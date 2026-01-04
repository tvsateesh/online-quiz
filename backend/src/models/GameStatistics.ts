import mongoose, { Schema, Document } from 'mongoose';

export interface IGameStatistics extends Document {
  userId: string;
  username: string;
  gameName: string;
  score: number;
  time: number; // in seconds
  difficulty?: string;
  moves?: number;
  result?: string; // 'win', 'loss', 'draw'
  details?: Record<string, any>;
  playedAt: Date;
  createdAt: Date;
}

let GameStatisticsModel: any;

try {
  const GameStatisticsSchema = new Schema(
    {
      userId: {
        type: String,
        required: [true, 'User ID is required'],
        index: true
      },
      username: {
        type: String,
        required: [true, 'Username is required']
      },
      gameName: {
        type: String,
        required: [true, 'Game name is required'],
        enum: ['word-hunt', 'chess', 'checkers', 'dice', 'stock-quiz'],
        index: true
      },
      score: {
        type: Number,
        required: [true, 'Score is required'],
        default: 0
      },
      time: {
        type: Number,
        required: [true, 'Time is required'],
        default: 0
      },
      difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
      },
      moves: {
        type: Number,
        default: 0
      },
      result: {
        type: String,
        enum: ['win', 'loss', 'draw'],
        default: 'draw'
      },
      details: {
        type: Schema.Types.Mixed,
        default: {}
      },
      playedAt: {
        type: Date,
        default: Date.now,
        index: true
      }
    },
    {
      timestamps: true
    }
  );

  // Index for querying user statistics
  GameStatisticsSchema.index({ userId: 1, playedAt: -1 });
  GameStatisticsSchema.index({ userId: 1, gameName: 1 });

  // @ts-ignore
  GameStatisticsModel = mongoose.model('GameStatistics', GameStatisticsSchema);
} catch (error) {
  console.warn('⚠️  Using in-memory mock database for GameStatistics');
  
  // Mock implementation
  GameStatisticsModel = {
    create: async (data: any) => {
      const id = `mock_stat_${Date.now()}_${Math.random()}`;
      return {
        _id: id,
        ...data,
        createdAt: new Date()
      };
    },
    find: async (query: any) => {
      // This will be handled by mockGameDb
      return [];
    },
    findOne: async (query: any) => {
      return null;
    }
  };
}

export default GameStatisticsModel;
