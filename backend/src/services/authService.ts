import jwt from 'jsonwebtoken';
import User from '../models/User';
import bcryptjs from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface SignUpData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  token?: string;
  error?: string;
}

export const authService = {
  async signup(data: SignUpData): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email: data.email }, { username: data.username }]
      });

      if (existingUser) {
        return {
          success: false,
          message: 'User already exists',
          error: existingUser.email === data.email ? 'Email already registered' : 'Username already taken'
        };
      }

      // Hash password before creating user
      const hashedPassword = await bcryptjs.hash(data.password, 10);

      // Create new user
      let newUser;
      if (User.create) {
        newUser = await User.create({
          username: data.username,
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName
        });
      } else {
        newUser = new User({
          username: data.username,
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName
        });
        await newUser.save();
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, username: newUser.username },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return {
        success: true,
        message: 'User registered successfully',
        user: {
          id: newUser._id.toString(),
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.firstName || undefined,
          lastName: newUser.lastName || undefined
        },
        token
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      return {
        success: false,
        message: 'Registration failed',
        error: errorMessage
      };
    }
  },

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      // Find user by email and include password
      const user = await User.findOne({ email: data.email }).select('+password') as any;

      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials',
          error: 'User not found'
        };
      }

      // Check password
      const isPasswordValid = await user.comparePassword(data.password);

      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid credentials',
          error: 'Incorrect password'
        };
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return {
        success: true,
        message: 'Login successful',
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined
        },
        token
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      return {
        success: false,
        message: 'Login failed',
        error: errorMessage
      };
    }
  }
};

