import express from 'express'; import cors from 'cors'; import dotenv from 'dotenv'; import { createServer } from 'http'; import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes'; import gameRoutes from './routes/gameRoutes'; import { setupSockets } from './sockets/socketHandler';
dotenv.config(); const app = express(); app.use(cors()); app.use(express.json());
app.use('/api/auth', authRoutes); app.use('/api/games', gameRoutes);
const httpServer = createServer(app); const io = new Server(httpServer, { cors: { origin: '*' } });
setupSockets(io);
httpServer.listen(process.env.PORT || 3001, () => { console.log('Server is running on port 3001'); });
