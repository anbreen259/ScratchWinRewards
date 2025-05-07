import { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertPrizeSchema,
  insertGameSettingsSchema
} from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "scratch-win-secret-key";

// Auth middleware
const authMiddleware = async (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  try {
    const user = await storage.verifyToken(token);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    // Add user to request
    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Admin middleware
const adminMiddleware = async (req: Request, res: Response, next: Function) => {
  const user = (req as any).user;
  
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Requires admin permission" });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // =====================
  // Auth Routes
  // =====================
  
  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    const result = await storage.authenticateUser(username, password);
    
    if (!result) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const { token, user } = result;
    
    // Return user data without password
    const { password: _, ...userData } = user;
    
    res.status(200).json({ token, user: userData });
  });
  
  // Check auth status
  app.get("/api/auth/status", authMiddleware, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { password: _, ...userData } = user;
    
    res.status(200).json({ user: userData });
  });
  
  // =====================
  // User Routes
  // =====================
  
  // Get all users (admin only)
  app.get("/api/users", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    const allUsers = await Promise.all(
      Array.from(Array(10).keys()).map(async (id) => {
        const user = await storage.getUser(id + 1);
        if (user) {
          // Remove password from response
          const { password: _, ...userData } = user;
          return userData;
        }
        return null;
      })
    );
    
    const validUsers = allUsers.filter(user => user !== null);
    
    res.status(200).json(validUsers);
  });
  
  // =====================
  // Prizes Routes
  // =====================
  
  // Get all prizes
  app.get("/api/prizes", async (req: Request, res: Response) => {
    const prizes = await storage.getAllPrizes();
    res.status(200).json(prizes);
  });
  
  // Get prize by ID
  app.get("/api/prizes/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid prize ID" });
    }
    
    const prize = await storage.getPrize(id);
    
    if (!prize) {
      return res.status(404).json({ message: "Prize not found" });
    }
    
    res.status(200).json(prize);
  });
  
  // Create prize (admin only)
  app.post("/api/prizes", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      const prizeData = insertPrizeSchema.parse(req.body);
      const newPrize = await storage.createPrize(prizeData);
      res.status(201).json(newPrize);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid prize data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create prize" });
    }
  });
  
  // Update prize (admin only)
  app.put("/api/prizes/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid prize ID" });
    }
    
    try {
      const updatedPrize = await storage.updatePrize(id, req.body);
      
      if (!updatedPrize) {
        return res.status(404).json({ message: "Prize not found" });
      }
      
      res.status(200).json(updatedPrize);
    } catch (error) {
      res.status(500).json({ message: "Failed to update prize" });
    }
  });
  
  // Delete prize (admin only)
  app.delete("/api/prizes/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid prize ID" });
    }
    
    const success = await storage.deletePrize(id);
    
    if (!success) {
      return res.status(404).json({ message: "Prize not found" });
    }
    
    res.status(200).json({ message: "Prize deleted successfully" });
  });
  
  // =====================
  // Game Settings Routes
  // =====================
  
  // Get game settings
  app.get("/api/settings", async (req: Request, res: Response) => {
    const settings = await storage.getGameSettings();
    res.status(200).json(settings);
  });
  
  // Update game settings (admin only)
  app.put("/api/settings", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
      const updatedSettings = await storage.updateGameSettings(req.body);
      res.status(200).json(updatedSettings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update game settings" });
    }
  });
  
  // =====================
  // Game Stats Routes
  // =====================
  
  // Get game stats
  app.get("/api/stats", async (req: Request, res: Response) => {
    const stats = await storage.getGameStats();
    res.status(200).json(stats);
  });
  
  // =====================
  // Game Play Routes
  // =====================
  
  // Play game and get result
  app.post("/api/play", async (req: Request, res: Response) => {
    try {
      // Determine if the player wins a prize
      const prize = await storage.determineWin();
      
      // Update game stats
      await storage.updateGameStats({
        gamesPlayed: (await storage.getGameStats()).gamesPlayed + 1
      });
      
      if (prize) {
        res.status(200).json({ 
          win: true,
          prize
        });
      } else {
        res.status(200).json({ 
          win: false,
          message: "Better luck next time!"
        });
      }
    } catch (error) {
      console.error("Error during gameplay:", error);
      res.status(500).json({ message: "An error occurred during gameplay" });
    }
  });

  return httpServer;
}
