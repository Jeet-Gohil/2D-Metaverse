import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import pg  from 'pg';
import  bodyParser from 'body-parser';
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import morgan from 'morgan';
dotenv.config();
// Initialize Express app
const app = express();


// Initialize WebSocket server


// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))
app.use(express.static('files'))
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


// PostgreSQL connection
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const pool = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect();
// REST API Routes

// Create a new user
app.post('/api/users', async (req, res) => {
  const { username, password, avatar_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password, avatar_url) VALUES ($1, $2, $3) RETURNING *',
      [username, password, avatar_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get a user by ID
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update a user
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password, avatar_url } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET username = $1, password = $2, avatar_url = $3 WHERE id = $4 RETURNING *',
      [username, password, avatar_url, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete a user
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.post("/api/auth/google", async (req, res) => {
  try {
    console.log("Received request at /google");
    console.log("Request Body:", req.body); // Debugging

    const { googleId, email, name, picture, emailVerified } = req.body;

    if (!googleId || !email || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if the user already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE google_id = $1", [googleId]);

    if (existingUser.rows.length > 0) {
      return res.status(200).json({ message: "User already exists", user: existingUser.rows[0] });
    }

    // Insert new user
    const newUser = await pool.query(
      "INSERT INTO users (google_id, email, name, picture, email_verified) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [googleId, email, name, picture, emailVerified]
    );

    console.log("User inserted:", newUser.rows[0]); // Debugging
    res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });
  } catch (error) {
    console.error("Error in Google Auth route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// WebSocket Connection


// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server, {
    cors: {
      origin: '*', // Allow all origins (update in production)
      methods: ['GET', 'POST'],
    },
  });

  const users = {};

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
  
    // Add user to the list
    users[socket.id] = socket;
  
    // Handle signaling messages
    socket.on('signal', (data) => {
      const { target, signal } = data;
      if (users[target]) {
        users[target].emit('signal', { sender: socket.id, signal });
      }
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      delete users[socket.id];
    });
  });
  
