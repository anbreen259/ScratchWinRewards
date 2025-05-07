import {
  users, type User, type InsertUser,
  prizes, type Prize, type InsertPrize,
  gameSettings, type GameSettings, type InsertGameSettings,
  gameStats, type GameStats, type InsertGameStats
} from "@shared/schema";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "scratch-win-secret-key";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStats(id: number, gamesPlayed?: number, prizesWon?: number): Promise<User | undefined>;
  
  // Prize methods
  getAllPrizes(): Promise<Prize[]>;
  getPrize(id: number): Promise<Prize | undefined>;
  createPrize(prize: InsertPrize): Promise<Prize>;
  updatePrize(id: number, prize: Partial<Prize>): Promise<Prize | undefined>;
  deletePrize(id: number): Promise<boolean>;
  
  // Game settings
  getGameSettings(): Promise<GameSettings>;
  updateGameSettings(settings: Partial<GameSettings>): Promise<GameSettings>;
  
  // Game stats
  getGameStats(): Promise<GameStats>;
  updateGameStats(stats: Partial<GameStats>): Promise<GameStats>;
  
  // Auth methods
  authenticateUser(username: string, password: string): Promise<{token: string, user: User} | null>;
  verifyToken(token: string): Promise<User | null>;
  
  // Game logic
  determineWin(): Promise<Prize | null>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private prizes: Map<number, Prize>;
  private gameSettings: GameSettings;
  private gameStats: GameStats;
  private usersCurrentId: number;
  private prizesCurrentId: number;
  
  constructor() {
    this.users = new Map();
    this.prizes = new Map();
    this.usersCurrentId = 1;
    this.prizesCurrentId = 1;
    
    // Populate with initial data
    this.initializeStorage();
  }
  
  private initializeStorage() {
    // Create default admin user
    const adminUser: User = {
      id: this.usersCurrentId++,
      username: "admin",
      password: "admin123", // This would be hashed in production
      role: "admin",
      lastLogin: new Date(),
      gamesPlayed: 0,
      prizesWon: 0
    };
    
    this.users.set(adminUser.id, adminUser);
    
    // Create default prizes
    const defaultPrizes: InsertPrize[] = [
      {
        name: "$100",
        description: "Gift Card",
        type: "Physical",
        value: "$100.00",
        icon: "gift",
        stock: 10,
        isActive: true,
        probability: 5,
      },
      {
        name: "Free",
        description: "Subscription",
        type: "Digital",
        value: "$49.99",
        icon: "star",
        stock: 0, // Unlimited
        isActive: true,
        probability: 15,
      },
      {
        name: "50% Off",
        description: "Next Purchase",
        type: "Discount",
        value: "Variable",
        icon: "percent",
        stock: 50,
        isActive: true,
        probability: 80,
      },
      {
        name: "Smart",
        description: "Watch",
        type: "Physical",
        value: "$199.99",
        icon: "clock",
        stock: 5,
        isActive: true,
        probability: 3,
      },
      {
        name: "Mystery",
        description: "Box",
        type: "Physical",
        value: "Variable",
        icon: "box",
        stock: 20,
        isActive: true,
        probability: 7,
      },
      {
        name: "Free",
        description: "Game",
        type: "Digital",
        value: "$59.99",
        icon: "gamepad",
        stock: 0, // Unlimited
        isActive: true,
        probability: 12,
      }
    ];
    
    for (const prize of defaultPrizes) {
      const newPrize = { ...prize, id: this.prizesCurrentId++ };
      this.prizes.set(newPrize.id, newPrize);
    }
    
    // Initialize game settings
    this.gameSettings = {
      id: 1,
      title: "Scratch & Win",
      instructionText: "Scratch the card below to reveal your prize",
      cardBackground: "default.png",
      primaryColor: "#1a365d",
      secondaryColor: "#ffc107",
      enableGame: true,
      showPrizeGallery: true,
      enableWinAnimations: true,
      requireUserRegistration: false,
      enableSocialSharing: false,
      playsPerUser: "3 per day",
      countdownTimer: 24,
      timerType: "Until next play",
      gameDuration: "1 month",
      globalWinRate: 25,
      adminNotifications: {
        emailOnHighValuePrize: true,
        dailySummaryReport: true,
        lowStockAlerts: false,
      },
      userNotifications: {
        prizeWinConfirmation: true,
        reminderToPlay: true,
        marketingCommunications: false,
      },
    };
    
    // Initialize game stats
    this.gameStats = {
      id: 1,
      totalPlayers: 1248,
      prizesWon: 246,
      gamesPlayed: 3157,
      weeklyGrowth: 15,
    };
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.usersCurrentId++;
    const user: User = { 
      ...insertUser, 
      id,
      lastLogin: new Date(),
      gamesPlayed: 0,
      prizesWon: 0
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserStats(id: number, gamesPlayed?: number, prizesWon?: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user,
      gamesPlayed: gamesPlayed !== undefined ? gamesPlayed : user.gamesPlayed,
      prizesWon: prizesWon !== undefined ? prizesWon : user.prizesWon,
      lastLogin: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Prize methods
  async getAllPrizes(): Promise<Prize[]> {
    return Array.from(this.prizes.values());
  }
  
  async getPrize(id: number): Promise<Prize | undefined> {
    return this.prizes.get(id);
  }
  
  async createPrize(prize: InsertPrize): Promise<Prize> {
    const id = this.prizesCurrentId++;
    const newPrize: Prize = { ...prize, id };
    this.prizes.set(id, newPrize);
    return newPrize;
  }
  
  async updatePrize(id: number, updates: Partial<Prize>): Promise<Prize | undefined> {
    const prize = this.prizes.get(id);
    if (!prize) return undefined;
    
    const updatedPrize = { ...prize, ...updates };
    this.prizes.set(id, updatedPrize);
    return updatedPrize;
  }
  
  async deletePrize(id: number): Promise<boolean> {
    return this.prizes.delete(id);
  }
  
  // Game settings
  async getGameSettings(): Promise<GameSettings> {
    return this.gameSettings;
  }
  
  async updateGameSettings(settings: Partial<GameSettings>): Promise<GameSettings> {
    this.gameSettings = { ...this.gameSettings, ...settings };
    return this.gameSettings;
  }
  
  // Game stats
  async getGameStats(): Promise<GameStats> {
    return this.gameStats;
  }
  
  async updateGameStats(stats: Partial<GameStats>): Promise<GameStats> {
    this.gameStats = { ...this.gameStats, ...stats };
    return this.gameStats;
  }
  
  // Auth methods
  async authenticateUser(username: string, password: string): Promise<{token: string, user: User} | null> {
    const user = await this.getUserByUsername(username);
    if (!user || user.password !== password) return null;
    
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Update last login
    const updatedUser = { ...user, lastLogin: new Date() };
    this.users.set(user.id, updatedUser);
    
    return { token, user: updatedUser };
  }
  
  async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      const user = await this.getUser(decoded.id);
      return user || null;
    } catch (error) {
      return null;
    }
  }
  
  // Game logic
  async determineWin(): Promise<Prize | null> {
    // Check if we should win based on global win rate
    const shouldWin = Math.random() * 100 < this.gameSettings.globalWinRate;
    if (!shouldWin) return null;
    
    // Get active prizes
    const activePrizes = Array.from(this.prizes.values())
      .filter(prize => prize.isActive && (prize.stock === 0 || prize.stock > 0));
    
    if (activePrizes.length === 0) return null;
    
    // Calculate total probability weight
    const totalWeight = activePrizes.reduce((sum, prize) => sum + prize.probability, 0);
    if (totalWeight === 0) return null;
    
    // Select prize based on weighted probability
    let random = Math.random() * totalWeight;
    for (const prize of activePrizes) {
      random -= prize.probability;
      if (random <= 0) {
        // Reduce stock if applicable
        if (prize.stock > 0) {
          this.updatePrize(prize.id, { stock: prize.stock - 1 });
        }
        
        // Update game stats
        this.updateGameStats({
          prizesWon: this.gameStats.prizesWon + 1,
          gamesPlayed: this.gameStats.gamesPlayed + 1
        });
        
        return prize;
      }
    }
    
    // Fallback to first prize if something went wrong
    const fallbackPrize = activePrizes[0];
    if (fallbackPrize.stock > 0) {
      this.updatePrize(fallbackPrize.id, { stock: fallbackPrize.stock - 1 });
    }
    
    // Update game stats
    this.updateGameStats({
      prizesWon: this.gameStats.prizesWon + 1,
      gamesPlayed: this.gameStats.gamesPlayed + 1
    });
    
    return fallbackPrize;
  }
}

export const storage = new MemStorage();
