import { Router, Request, Response } from 'express';
import GameStatistics from '../models/GameStatistics';
import { mockDb } from '../config/mockDatabase';

const gameStatsRouter = Router();

const USE_MOCK = process.env.USE_MOCK === 'true' || !process.env.MONGODB_URI;

// Save game statistics
gameStatsRouter.post('/statistics', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      username,
      gameName,
      score,
      time,
      difficulty,
      moves,
      result,
      details
    } = req.body;

    // Validation
    if (!userId || !username || !gameName || score === undefined || !time) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, username, gameName, score, time'
      });
    }

    if (!['word-hunt', 'chess', 'checkers', 'dice', 'stock-quiz'].includes(gameName)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid game name'
      });
    }

    let stat;

    if (USE_MOCK) {
      stat = await mockDb.saveGameStatistic({
        userId,
        username,
        gameName,
        score,
        time,
        difficulty: difficulty || 'medium',
        moves: moves || 0,
        result: result || 'draw',
        details: details || {}
      });
    } else {
      stat = await GameStatistics.create({
        userId,
        username,
        gameName,
        score,
        time,
        difficulty: difficulty || 'medium',
        moves: moves || 0,
        result: result || 'draw',
        details: details || {}
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Game statistics saved successfully',
      data: stat
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

// Get all game statistics for a user
gameStatsRouter.get('/statistics/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    let stats;

    if (USE_MOCK) {
      stats = await mockDb.getGameStatistics(userId);
    } else {
      stats = await GameStatistics.find({ userId }).sort({ playedAt: -1 });
    }

    return res.status(200).json({
      success: true,
      data: stats,
      total: stats.length
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

// Get statistics for a specific game
gameStatsRouter.get('/statistics/:userId/:gameName', async (req: Request, res: Response) => {
  try {
    const { userId, gameName } = req.params;

    if (!userId || !gameName) {
      return res.status(400).json({
        success: false,
        error: 'User ID and game name are required'
      });
    }

    let stats;

    if (USE_MOCK) {
      stats = await mockDb.getGameStatisticsByGame(userId, gameName);
    } else {
      stats = await GameStatistics.find({ userId, gameName }).sort({ playedAt: -1 });
    }

    // Calculate aggregate statistics
    const totalGames = stats.length;
    const totalScore = stats.reduce((sum, s) => sum + s.score, 0);
    const avgScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
    const totalTime = stats.reduce((sum, s) => sum + s.time, 0);
    const wins = stats.filter(s => s.result === 'win').length;
    const losses = stats.filter(s => s.result === 'loss').length;
    const draws = stats.filter(s => s.result === 'draw').length;

    return res.status(200).json({
      success: true,
      data: {
        gameName,
        games: stats,
        aggregate: {
          totalGames,
          totalScore,
          avgScore,
          totalTime,
          wins,
          losses,
          draws,
          winRate: totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0
        }
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

// Get summary statistics for all games
gameStatsRouter.get('/summary/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    let allStats;

    if (USE_MOCK) {
      allStats = await mockDb.getGameStatistics(userId);
    } else {
      allStats = await GameStatistics.find({ userId });
    }

    // Group by game and calculate statistics
    const gameMap = new Map<string, any>();

    allStats.forEach((stat: any) => {
      if (!gameMap.has(stat.gameName)) {
        gameMap.set(stat.gameName, {
          gameName: stat.gameName,
          totalGames: 0,
          totalScore: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          totalTime: 0,
          recentScore: 0
        });
      }

      const game = gameMap.get(stat.gameName);
      game.totalGames += 1;
      game.totalScore += stat.score;
      if (stat.result === 'win') game.wins += 1;
      if (stat.result === 'loss') game.losses += 1;
      if (stat.result === 'draw') game.draws += 1;
      game.totalTime += stat.time;
      if (!game.recentScore) game.recentScore = stat.score;
    });

    // Calculate averages
    const summary = Array.from(gameMap.values()).map((game: any) => ({
      ...game,
      avgScore: game.totalGames > 0 ? Math.round(game.totalScore / game.totalGames) : 0,
      winRate: game.totalGames > 0 ? Math.round((game.wins / game.totalGames) * 100) : 0
    }));

    return res.status(200).json({
      success: true,
      data: {
        userId,
        totalGamesPlayed: allStats.length,
        gameStats: summary
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

export default gameStatsRouter;
