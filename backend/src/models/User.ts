import mongoose, { Schema, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

// Mock database for testing without MongoDB
const mockUsers: Map<string, any> = new Map();
let mockIdCounter = 1;

// Try to create Mongoose schema, fallback to mock if MongoDB unavailable
let UserModel: any;

try {
  const UserSchema = new Schema(
    {
      username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [3, 'Username must be at least 3 characters']
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
      },
      firstName: {
        type: String,
        trim: true
      },
      lastName: {
        type: String,
        trim: true
      }
    },
    {
      timestamps: true
    }
  );

  // Don't use pre-save hook, hash password in service instead
  
  UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
    return await bcryptjs.compare(password, this.password);
  };

  // @ts-ignore
  UserModel = mongoose.model('User', UserSchema);
} catch (error) {
  console.warn('⚠️  MongoDB not available, using in-memory mock database for testing');
  
  UserModel = {
    findOne: async (query: any) => {
      const users = Array.from(mockUsers.values());
      
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
    },
    
    create: async (data: any) => {
      const id = `mock_${mockIdCounter++}`;
      const now = new Date();
      const hashedPassword = await bcryptjs.hash(data.password, 10);
      
      const user = {
        _id: id,
        username: data.username,
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        createdAt: now,
        updatedAt: now,
        comparePassword: async function(password: string) {
          return await bcryptjs.compare(password, this.password);
        },
        save: async function() {
          return this;
        }
      };
      
      mockUsers.set(id, user);
      return user;
    }
  };
}

export default UserModel;


