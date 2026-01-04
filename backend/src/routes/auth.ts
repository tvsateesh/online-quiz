import { Router, Request, Response } from 'express';
import { authService } from '../services/authService';

const authRouter = Router();

// Sign up endpoint
authRouter.post('/signup', async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username, email, and password are required'
      });
    }

    const result = await authService.signup({
      username,
      email,
      password,
      firstName,
      lastName
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

// Login endpoint
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const result = await authService.login({ email, password });

    if (!result.success) {
      return res.status(401).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

// Google login endpoint
authRouter.post('/google-login', async (req: Request, res: Response) => {
  try {
    const { email, name, picture } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const result = await authService.googleLogin({ email, name, picture });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

export default authRouter;
