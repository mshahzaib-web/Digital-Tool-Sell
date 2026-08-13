const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const User = require("./models/User");
const Tool = require("./models/Tool");

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "https://digitaltoolsell.pages.dev",
      "http://localhost:5173", // Optional: useful for local frontend development
    ], // Allow all origins for the development demo
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "x-admin-username", "x-admin-password"],
  }),
);
app.use(express.json());

// Database connection

// Seeding Function
const seedDatabase = async () => {
  try {
    // 1. Seed Default Admin User
    const adminExists = await User.findOne({ username: "mshahzaib" });
    if (!adminExists) {
      await User.create({
        username: "mshahzaib",
        password: "pakistan123",
      });
      console.log("Seeded default admin user set");
    } else {
      console.log("Admin user already exists.");
    }

    // 2. Seed Tools if database is empty
    // const toolsCount = await Tool.countDocuments();
    // if (toolsCount === 0) {
    //   const initialTools = [
    //     {
    //       toolName: "CapCut Pro",
    //       image:
    //         "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
    //       category: "Design & AI Tools",
    //       price: 1.0,
    //       pricingType: "Monthly Subscription",
    //       description:
    //         "Professional video editor with AI-powered features. Auto captions, templates, effects, and multi-track editing capabilities.",
    //       features: [
    //         "Unlimited Exports",
    //         "Premium Transitions",
    //         "AI Auto-Captions",
    //         "4K Resolution Export",
    //         "Exclusive Audio Library",
    //       ],
    //       stockStatus: "In Stock",
    //       deliveryTime: "Instant",
    //       sellerNotes: "Monthly subscription with unlimited access.",
    //       websiteUrl: "https://capcut.com",
    //       rating: 4.6,
    //       discount: 60,
    //     },
    //     {
    //       toolName: "Envato Elements",
    //       image:
    //         "https://images.unsplash.com/photo-1618005198143-e5283b519a7f?w=400&auto=format&fit=crop&q=80",
    //       category: "Design & AI Tools",
    //       price: 1.54,
    //       pricingType: "Monthly Subscription",
    //       description:
    //         "Unlimited downloads of premium stock assets — photos, videos, audio, templates, fonts, and WordPress themes.",
    //       features: [
    //         "Unlimited Downloads",
    //         "Stock Photos & Videos",
    //         "Video Templates",
    //         "Audio Tracks",
    //         "WordPress Themes & Plugins",
    //       ],
    //       stockStatus: "In Stock",
    //       deliveryTime: "Instant",
    //       sellerNotes: "Monthly subscription with unlimited access.",
    //       websiteUrl: "https://elements.envato.com",
    //       rating: 4.7,
    //       discount: 72,
    //     },
    //     {
    //       toolName: "Jasper AI",
    //       image:
    //         "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&auto=format&fit=crop&q=80",
    //       category: "AI Tools",
    //       price: 2.1,
    //       pricingType: "Monthly Subscription",
    //       description:
    //         "AI copywriting tool for marketing teams. Generate blog posts, ads, social media content, and emails in seconds.",
    //       features: [
    //         "50+ Copywriting Templates",
    //         "Long-Form Document Editor",
    //         "Plagiarism Checker Integration",
    //         "Brand Voice Customization",
    //         "Multi-Language Support",
    //       ],
    //       stockStatus: "In Stock",
    //       deliveryTime: "Instant",
    //       sellerNotes: "Shared premium account. Private workspace.",
    //       websiteUrl: "https://jasper.ai",
    //       rating: 4.7,
    //       discount: 70,
    //     },
    //     {
    //       toolName: "Midjourney",
    //       image:
    //         "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&auto=format&fit=crop&q=80",
    //       category: "AI Tools",
    //       price: 2.1,
    //       pricingType: "Monthly Subscription",
    //       description:
    //         "AI image generation that creates stunning artwork. Perfect for designers, concepts, and digital art generation.",
    //       features: [
    //         "Fast GPU Hours",
    //         "Relax Mode Unlimited",
    //         "Commercial License",
    //         "Stealth Mode Option",
    //         "High-Resolution Upscales",
    //       ],
    //       stockStatus: "In Stock",
    //       deliveryTime: "Instant",
    //       sellerNotes: "Discord access via shared server invite.",
    //       websiteUrl: "https://midjourney.com",
    //       rating: 4.9,
    //       discount: 85,
    //     },
    //     {
    //       toolName: "Moz Pro",
    //       image:
    //         "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80",
    //       category: "SEO Tools",
    //       price: 2.25,
    //       pricingType: "Monthly Subscription",
    //       description:
    //         "Powerful SEO software for keyword research, link building, and site audits. Trusted by top marketers globally.",
    //       features: [
    //         "Keyword Explorer",
    //         "Link Explorer (DA/PA)",
    //         "Site Crawl & Audit",
    //         "Rank Tracking",
    //         "Page Optimization Advice",
    //       ],
    //       stockStatus: "In Stock",
    //       deliveryTime: "Instant",
    //       sellerNotes: "Private login shared account.",
    //       websiteUrl: "https://moz.com",
    //       rating: 4.6,
    //       discount: 75,
    //     },
    //     {
    //       toolName: "Adobe Creative Cloud",
    //       image:
    //         "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
    //       category: "Design & AI Tools",
    //       price: 3.0,
    //       pricingType: "Monthly Subscription",
    //       description:
    //         "Access all 20+ Adobe Creative apps including Photoshop, Illustrator, Premiere Pro, and Acrobat Pro.",
    //       features: [
    //         "Photoshop & Illustrator",
    //         "Premiere Pro & After Effects",
    //         "100GB Cloud Storage",
    //         "Adobe Fonts Access",
    //         "Creative Cloud Libraries",
    //       ],
    //       stockStatus: "In Stock",
    //       deliveryTime: "1-2 Hours",
    //       sellerNotes: "Invited to team workspace under your email.",
    //       websiteUrl: "https://adobe.com",
    //       rating: 4.8,
    //       discount: 80,
    //     },
    //     {
    //       toolName: "ChatGPT Plus",
    //       image:
    //         "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400&auto=format&fit=crop&q=80",
    //       category: "AI Tools",
    //       price: 3.6,
    //       pricingType: "Monthly Subscription",
    //       description:
    //         "Access GPT-4, DALL-E image generation, advanced data analysis, and plugins. Faster response speed and priority access.",
    //       features: [
    //         "GPT-4 Access",
    //         "DALL-E 3 Image Creator",
    //         "Advanced Data Analysis",
    //         "Custom GPTs Explorer",
    //         "Web Browsing Capabilities",
    //       ],
    //       stockStatus: "In Stock",
    //       deliveryTime: "Instant",
    //       sellerNotes: "Shared login credentials with dedicated profiles.",
    //       websiteUrl: "https://chatgpt.com",
    //       rating: 4.9,
    //       discount: 55,
    //     },
    //     {
    //       toolName: "Grammarly Premium",
    //       image:
    //         "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&auto=format&fit=crop&q=80",
    //       category: "Writing Tools",
    //       price: 0.75,
    //       pricingType: "Monthly Subscription",
    //       description:
    //         "AI-powered writing assistant that helps you write clearly and effectively. Grammar, tone, clarity, and plagiarism checks.",
    //       features: [
    //         "Advanced Grammar Corrections",
    //         "Tone Adjustments",
    //         "Clarity & Conciseness Rewrites",
    //         "Plagiarism Detector",
    //         "Vocabulary Enhancements",
    //       ],
    //       stockStatus: "In Stock",
    //       deliveryTime: "Instant",
    //       sellerNotes: "Chrome extension and web app credentials.",
    //       websiteUrl: "https://grammarly.com",
    //       rating: 4.8,
    //       discount: 75,
    //     },
    //     {
    //       toolName: "Netflix Premium",
    //       image:
    //         "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&auto=format&fit=crop&q=80",
    //       category: "Streaming Services",
    //       price: 2.0,
    //       pricingType: "Monthly Subscription",
    //       description:
    //         "Stream unlimited movies and TV shows in 4K Ultra HD. Netflix Premium shared plan with individual profile lock.",
    //       features: [
    //         "4K Ultra HD Streaming",
    //         "4 Screens Simultaneously",
    //         "Offline Downloads Enabled",
    //         "Personal Locked Profile",
    //         "Spatial Audio Features",
    //       ],
    //       stockStatus: "In Stock",
    //       deliveryTime: "Instant",
    //       sellerNotes: "1 Profile with Custom PIN code access.",
    //       websiteUrl: "https://netflix.com",
    //       rating: 4.7,
    //       discount: 60,
    //     },
    //     {
    //       toolName: "Canva Pro",
    //       image:
    //         "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&auto=format&fit=crop&q=80",
    //       category: "Design & AI Tools",
    //       price: 1.2,
    //       pricingType: "Monthly Subscription",
    //       description:
    //         "Design anything — social media posts, presentations, logos, and more with Canva Pro's premium assets and features.",
    //       features: [
    //         "100M+ Premium Stock Photos",
    //         "Brand Kit Management",
    //         "One-Click Resize Tool",
    //         "Background Remover",
    //         "Schedule Social Media Posts",
    //       ],
    //       stockStatus: "In Stock",
    //       deliveryTime: "Instant",
    //       sellerNotes: "Invited to Pro team workspace.",
    //       websiteUrl: "https://canva.com",
    //       rating: 4.9,
    //       discount: 70,
    //     },
    //     {
    //       toolName: "Ahrefs Pro",
    //       image:
    //         "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80",
    //       category: "SEO Tools",
    //       price: 2.6,
    //       pricingType: "Monthly Subscription",
    //       description:
    //         "The most comprehensive SEO toolset on the market. Site explorer, keywords explorer, site audit, rank tracker, and content explorer.",
    //       features: [
    //         "Site Explorer & Backlink Audit",
    //         "Keywords Explorer",
    //         "Site Audit & Health Check",
    //         "Rank Tracker Dashboard",
    //         "Content Explorer Search",
    //       ],
    //       stockStatus: "In Stock",
    //       deliveryTime: "Instant",
    //       sellerNotes: "Shared account access via secure extension login.",
    //       websiteUrl: "https://ahrefs.com",
    //       rating: 4.8,
    //       discount: 80,
    //     },
    //     {
    //       toolName: "Semrush Pro",
    //       image:
    //         "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&auto=format&fit=crop&q=80",
    //       category: "SEO Tools",
    //       price: 1.5,
    //       pricingType: "Monthly Subscription",
    //       description:
    //         "All-in-one digital marketing suite trusted by 10 million marketers. Keyword research, competitor analysis, PPC, and social media.",
    //       features: [
    //         "Keyword Research Tools",
    //         "Competitor Domain Analytics",
    //         "Backlink Analysis Suite",
    //         "On-Page SEO Checker",
    //         "Social Media Poster",
    //       ],
    //       stockStatus: "In Stock",
    //       deliveryTime: "Instant",
    //       sellerNotes: "Shared credentials with standard access.",
    //       websiteUrl: "https://semrush.com",
    //       rating: 4.9,
    //       discount: 85,
    //     },
    //   ];

    //   await Tool.insertMany(initialTools);
    //   console.log("Seeded initial digital tools database.");
    // }
  } catch (error) {
    console.error("Seeding database failed:", error);
  }
};

// Mount API Routes
app.use("/api", require("./routes/toolRoutes"));
app.use("/api", require("./routes/authRoutes"));

// Root route
app.get("/", (req, res) => {
  res.send("VaultX API is running successfully with Azure link.");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Run server
const startServer = async () => {
  try {
    await connectDB();

    await seedDatabase();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start application:", error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
