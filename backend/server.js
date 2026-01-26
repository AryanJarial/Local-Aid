import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();
connectDB();

const app = express();

/* ===============================
   CORS CONFIG (STABLE & SAFE)
================================ */

const allowedOrigins = [
  'http://localhost:5173',
  'https://local-aid.vercel.app',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow Postman / server-to-server requests
    if (!origin) return callback(null, true);

    // Allow localhost, prod domain, and ALL Vercel previews
    if (
      allowedOrigins.includes(origin) ||
      (typeof origin === 'string' && origin.endsWith('.vercel.app'))
    ) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions)); // DO NOT add app.options()

/* ===============================
   MIDDLEWARE
================================ */

app.use(express.json());

/* ===============================
   ROUTES
================================ */

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

/* ===============================
   SOCKET.IO
================================ */

const httpServer = createServer(app);

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: corsOptions,
});

app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
  });

  socket.on('typing', (room) => {
    socket.in(room).emit('typing');
  });

  socket.on('stop typing', (room) => {
    socket.in(room).emit('stop typing');
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
});

/* ===============================
   SERVER START
================================ */

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
