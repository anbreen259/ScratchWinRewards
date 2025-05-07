import { db } from "./db";
import { users, prizes, gameSettings, gameStats, type InsertPrize, type InsertGameSettings, type InsertGameStats } from "@shared/schema";

// Initialize the database with default data
async function initializeDatabase() {
  console.log("Initializing database with default data...");

  // Check if admin user exists
  const existingUsers = await db.select().from(users);
  if (existingUsers.length === 0) {
    console.log("Creating admin user...");
    await db.insert(users).values({
      username: "admin",
      password: "admin123", // This would be hashed in production
      role: "admin",
      lastLogin: new Date(),
      gamesPlayed: 0,
      prizesWon: 0
    });
  } else {
    console.log("Admin user already exists, skipping...");
  }

  // Check if prizes exist
  const existingPrizes = await db.select().from(prizes);
  if (existingPrizes.length === 0) {
    console.log("Creating default prizes...");
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
    await db.insert(prizes).values(defaultPrizes);
  } else {
    console.log("Prizes already exist, skipping...");
  }

  // Check if game settings exist
  const existingSettings = await db.select().from(gameSettings);
  if (existingSettings.length === 0) {
    console.log("Creating default game settings...");
    const defaultSettings: InsertGameSettings = {
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
    await db.insert(gameSettings).values(defaultSettings);
  } else {
    console.log("Game settings already exist, skipping...");
  }

  // Check if game stats exist
  const existingStats = await db.select().from(gameStats);
  if (existingStats.length === 0) {
    console.log("Creating default game stats...");
    const defaultStats: InsertGameStats = {
      totalPlayers: 1248,
      prizesWon: 246,
      gamesPlayed: 3157,
      weeklyGrowth: 15,
    };
    await db.insert(gameStats).values(defaultStats);
  } else {
    console.log("Game stats already exist, skipping...");
  }

  console.log("Database initialization completed!");
}

// Call the initialization function
initializeDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error initializing database:", error);
    process.exit(1);
  });