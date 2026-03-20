import { Response } from 'express'; import { AuthRequest } from '../middlewares/authMiddleware'; import db from '../db'; import { initialGameState } from '../gameLogic/state';
export const createLobby = async (req: AuthRequest, res: Response) => {
  try {
    const [game] = await db('games').insert({ status: 'lobby', created_by: req.user!.id, state: JSON.stringify(initialGameState()) }).returning('*');
    await db('game_players').insert({ game_id: game.id, user_id: req.user!.id, turn_order: 1 });
    res.status(201).json(game);
  } catch (e) { res.status(500).json({ message: 'Error' }); }
};
export const getLobbies = async (req: AuthRequest, res: Response) => { try { res.json(await db('games').where({ status: 'lobby' })); } catch (e) { res.status(500).json({ message: 'Error' }); } };
export const getLeaderboard = async (req: AuthRequest, res: Response) => { try { res.json(await db('leaderboards').join('users', 'users.id', 'leaderboards.user_id').select('username', 'total_wins', 'highest_net_worth').orderBy('total_wins', 'desc')); } catch (e) { res.status(500).json({ message: 'Error' }); } };
