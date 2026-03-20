import { Router } from 'express'; import { createLobby, getLobbies, getLeaderboard } from '../controllers/gameController'; import { authenticateToken } from '../middlewares/authMiddleware';
const router = Router(); router.use(authenticateToken); router.post('/lobbies', createLobby); router.get('/lobbies', getLobbies); router.get('/leaderboard', getLeaderboard); export default router;
