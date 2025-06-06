require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const chatRoutes = require('./routes/chatRoutes');
const cors = require("cors");
const http = require("http");
const Message = require("./models/Message");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // yahan apne frontend URL daal sakte ho for production
    methods: ["GET", "POST"],
  },
});


const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'https://flipkartassit.vercel.app',
  'https://flipkartassit-admin.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register", (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, content }) => {
    try {

      if (!senderId || !receiverId || !content) return;
  
      const message = await Message.create({ sender: senderId, receiver: receiverId, content });
 
        io.emit("receiveMessage", message);
      
    } catch (error) {
      console.error("Error in sendMessage socket event:", error);
    }
  });
  

  socket.on("disconnect", () => {
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
