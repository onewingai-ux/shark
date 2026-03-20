import { Server, Socket } from 'socket.io';
import db from '../db'; import { GameState, CompanyColor } from '../gameLogic/state'; import { rollDice, placeBuilding, advancePhase, buyShares, sellShares } from '../gameLogic/engine'; import { takeAITurn } from '../gameLogic/ai';
export const setupSockets = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    socket.on('join_game', async (data: { gameId: number, userId: number }) => {
      socket.join(`game_${data.gameId}`);
      const game = await db('games').where({ id: data.gameId }).first();
      let state: GameState = typeof game.state === 'string' ? JSON.parse(game.state) : game.state;
      const user = await db('users').where({ id: data.userId }).first();
      if (!state.players.find(p => p.id === data.userId)) {
        state.players.push({ id: data.userId, username: user.username, isAi: false, cash: 5000, stocks: { red: 0, blue: 0, green: 0, yellow: 0 } });
        if (state.players.length === 1) state.players.push({ id: 'ai_1', username: 'SharkBot_1', isAi: true, cash: 5000, stocks: { red: 0, blue: 0, green: 0, yellow: 0 } });
        await db('games').where({ id: data.gameId }).update({ state: JSON.stringify(state) });
      }
      io.to(`game_${data.gameId}`).emit('game_state_update', state);
    });
    socket.on('perform_action', async (data: { gameId: number, userId: number, action: string, payload: any }) => {
      const { gameId, userId, action, payload } = data; const game = await db('games').where({ id: gameId }).first();
      if (!game) return; let state: GameState = typeof game.state === 'string' ? JSON.parse(game.state) : game.state;
      if (state.players[state.turnIndex].id !== userId) return;
      switch (action) {
        case 'roll_dice': state = rollDice(state); state.phase = 'Roll & Place'; break;
        case 'place_building': state = advancePhase(placeBuilding(state, payload.row, payload.col, payload.color)); break;
        case 'buy_shares': state = buyShares(state, payload.color as CompanyColor, payload.amount); break;
        case 'sell_shares': state = sellShares(state, payload.color as CompanyColor, payload.amount); break;
        case 'end_phase': state = advancePhase(state); break;
      }
      while (state.players[state.turnIndex].isAi) state = takeAITurn(state);
      await db('games').where({ id: gameId }).update({ state: JSON.stringify(state) });
      io.to(`game_${gameId}`).emit('game_state_update', state);
    });
  });
};
