import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import { FireModel, FireModels } from "./models/user.js";

dotenv.config();

const app = express();
const corsOptions = {
  origin: ['https://firescrim.vercel.app', 'https://firescrim-frontend.vercel.app', "http://localhost:5173", "http://localhost:5174", "https://firescrim.netlify.app", "https://test-umber-kappa-75.vercel.app"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const secret = process.env.JWT_SECRET || "defaultSecret";
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

app.post('/register', async (req, res) => {
  const { name, username, password, freefireid } = req.body;
  
  try {
    const existingUser = await FireModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new FireModel({ name, username, password: hashedPassword, freefireid });
    await newUser.save();
    
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await FireModel.findOne({ username });
    if (!user) {
      return res.status(404).json("No record exists");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json("The password is incorrect");
    }

    const token = jwt.sign({ username }, secret, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

    res.json("success");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/payment", async (req, res) => {
  try {
    const registration = await FireModels.create(req.body);
    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/items', async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).send('Token not found');
  }

  try {
    const decoded = jwt.verify(token, secret);
    const data = await FireModels.find({ username: decoded.username });

    if (!data) {
      return res.status(404).send('User not found');
    }

    res.json(data);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
