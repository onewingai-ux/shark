import { GameState, CompanyColor } from './state';
import { isValidPlacement, placeBuilding, rollDice, buyShares, advancePhase } from './engine';
const COLORS: CompanyColor[] = ['red', 'blue', 'green', 'yellow'];
export const takeAITurn = (state: GameState): GameState => {
  let newState = JSON.parse(JSON.stringify(state)) as GameState; const p = newState.players[newState.turnIndex];
  if (!p.isAi) return newState;
  newState.logs.push(`AI ${p.username} thinking...`);
  if (newState.phase === 'Pre-Roll Buy/Sell') {
    const s = COLORS.map(c => ({ color: c, price: newState.companies[c].stockPrice })).filter(c => c.price >= 1000).sort((a, b) => a.price - b.price);
    if (s.length > 0 && p.cash >= s[0].price) newState = buyShares(newState, s[0].color, 1);
    newState = advancePhase(newState);
  }
  if (newState.phase === 'Roll & Place') {
    newState = rollDice(newState); const d = newState.currentDice;
    const m = []; const tc = (d.company === 'black' || d.company === 'white') ? COLORS[Math.floor(Math.random()*4)] : d.company as CompanyColor;
    for (let r = 0; r < newState.board.length; r++) {
      for (let c = 0; c < newState.board[r].length; c++) {
        if (!newState.board[r][c].building && (d.zone === 'S' ? newState.board[r][c].zone === 'S' : newState.board[r][c].zone === d.zone)) {
           const val = isValidPlacement(newState, r, c, tc);
           if (val.valid) m.push({ r, c, takeover: !!(val.takeoverChains && val.takeoverChains.length > 0), color: tc });
        }
      }
    }
    if (m.length > 0) {
      const tm = m.filter(x => x.takeover); const ch = tm.length > 0 ? tm[Math.floor(Math.random() * tm.length)] : m[Math.floor(Math.random() * m.length)];
      newState = advancePhase(placeBuilding(newState, ch.r, ch.c, ch.color));
    } else { newState.logs.push(`AI no moves.`); newState = advancePhase(newState); }
  }
  if (newState.phase === 'Post-Roll Buy/Sell') newState = advancePhase(newState);
  return newState;
};
