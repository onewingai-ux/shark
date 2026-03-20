import { Request, Response } from 'express'; import bcrypt from 'bcryptjs'; import jwt from 'jsonwebtoken'; import db from '../db';
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (await db('users').where({ username }).first()) return res.status(400).json({ message: 'Exists' });
    const [user] = await db('users').insert({ username, password_hash: await bcrypt.hash(password, 10) }).returning(['id', 'username']);
    await db('leaderboards').insert({ user_id: user.id });
    res.status(201).json({ token: jwt.sign(user, process.env.JWT_SECRET || 'secret'), user });
  } catch (e) { res.status(500).json({ message: 'Error' }); }
};
export const login = async (req: Request, res: Response) => {
  try {
    const user = await db('users').where({ username: req.body.username }).first();
    if (!user || !(await bcrypt.compare(req.body.password, user.password_hash))) return res.status(401).json({ message: 'Invalid' });
    res.json({ token: jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'secret'), user: { id: user.id, username: user.username } });
  } catch (e) { res.status(500).json({ message: 'Error' }); }
};
export const getMe = (req: any, res: Response) => res.json({ user: req.user });
