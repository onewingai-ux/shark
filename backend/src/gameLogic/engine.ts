import { GameState, CompanyColor, Phase } from './state';
const COLORS: CompanyColor[] = ['red', 'blue', 'green', 'yellow'];
export const calculateBoardState = (state: GameState): { chains: any[], stockPrices: Record<CompanyColor, number> } => {
  const { board } = state; const visited = new Set<string>(); const chains: { color: CompanyColor; size: number; coords: [number, number][] }[] = [];
  const getNeighbors = (r: number, c: number) => [[r-1, c], [r+1, c], [r, c-1], [r, c+1]].filter(([nr, nc]) => nr >= 0 && nr < board.length && nc >= 0 && nc < board[r].length);
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c].building && !visited.has(`${r},${c}`)) {
        const color = board[r][c].building!; const coords: [number, number][] = []; const queue: [number, number][] = [[r, c]]; visited.add(`${r},${c}`);
        while (queue.length > 0) {
          const [currR, currC] = queue.shift()!; coords.push([currR, currC]);
          for (const [nr, nc] of getNeighbors(currR, currC)) {
            if (board[nr][nc].building === color && !visited.has(`${nr},${nc}`)) { visited.add(`${nr},${nc}`); queue.push([nr, nc]); }
          }
        }
        chains.push({ color, size: coords.length, coords });
      }
    }
  }
  const stockPrices: Record<CompanyColor, number> = { red: 0, blue: 0, green: 0, yellow: 0 };
  for (const chain of chains) { if (chain.size > 1) stockPrices[chain.color] += chain.size * 1000; else if (stockPrices[chain.color] === 0) stockPrices[chain.color] = 1000; }
  for (const color of COLORS) {
    if (!board.some(row => row.some(cell => cell.building === color))) stockPrices[color] = 0;
    else if (stockPrices[color] === 0) stockPrices[color] = 1000;
  }
  return { chains, stockPrices };
};
export const rollDice = (state: GameState): GameState => {
  if (state.phase !== 'Roll & Place') return state;
  const colorRoll = Math.floor(Math.random() * 6);
  const company = colorRoll < 4 ? COLORS[colorRoll] : (colorRoll === 4 ? 'black' : 'white');
  const zoneRoll = Math.floor(Math.random() * 6);
  const zone = zoneRoll < 4 ? zoneRoll + 1 : 'S';
  return { ...state, currentDice: { company, zone }, logs: [...state.logs, `${state.players[state.turnIndex].username} rolled ${company} in zone ${zone}`] };
};
export const isValidPlacement = (state: GameState, r: number, c: number, color: CompanyColor): { valid: boolean; takeoverChains?: [number, number][] } => {
  const cell = state.board[r][c]; if (cell.building || (state.currentDice.zone !== null && cell.zone !== state.currentDice.zone)) return { valid: false };
  const neighbors = [[r-1, c], [r+1, c], [r, c-1], [r, c+1]].filter(([nr, nc]) => nr >= 0 && nr < state.board.length && nc >= 0 && nc < state.board[nr].length);
  const { chains } = calculateBoardState(state);
  const pSize = 1 + chains.filter(ch => ch.color === color && neighbors.some(([nr, nc]) => ch.coords.some(([cr, cc]: any) => cr === nr && cc === nc))).reduce((s, ch) => s + ch.size, 0);
  const takeovers: [number, number][] = [];
  for (const [nr, nc] of neighbors) {
    const nb = state.board[nr][nc];
    if (nb.building && nb.building !== color) {
      const nbChain = chains.find(ch => ch.coords.some(([cr, cc]: any) => cr === nr && cc === nc));
      if (nbChain) { if (pSize > nbChain.size) takeovers.push(...nbChain.coords); else return { valid: false }; }
    }
  }
  return { valid: true, takeoverChains: takeovers.length > 0 ? takeovers : undefined };
};
export const placeBuilding = (state: GameState, r: number, c: number, chosenColor: CompanyColor): GameState => {
  if (state.phase !== 'Roll & Place' || !state.currentDice.zone) return state;
  const color = ['black', 'white'].includes(state.currentDice.company!) ? chosenColor : state.currentDice.company as CompanyColor;
  const val = isValidPlacement(state, r, c, color); if (!val.valid) return state;
  const newState = JSON.parse(JSON.stringify(state)) as GameState; const p = newState.players[newState.turnIndex];
  newState.board[r][c].building = color; newState.companies[color].availableBuildings -= 1;
  if (val.takeoverChains) { newState.logs.push(`${p.username} takeover!`); for (const [tr, tc] of val.takeoverChains) newState.board[tr][tc].building = null; }
  const { chains, stockPrices: newP } = calculateBoardState(newState); const oldP = { ...state.companies };
  newState.phase = 'Dividends & Losses';
  const isLone = !chains.find(ch => ch.color === color && ch.coords.some(([cr, cc]: any) => cr === r && cc === c))?.size || chains.find(ch => ch.color === color && ch.coords.some(([cr, cc]: any) => cr === r && cc === c))!.size === 1;
  const bonus = isLone ? 1000 : newP[color]; p.cash += bonus; newState.logs.push(`${p.username} earned ${bonus}.`);
  COLORS.forEach(co => newState.companies[co].stockPrice = newP[co]);
  COLORS.forEach(co => {
    const diff = newP[co] - oldP[co].stockPrice;
    newState.players.forEach(pl => {
      if (pl.stocks[co] > 0) {
        if (diff > 0) { pl.cash += pl.stocks[co] * diff; newState.logs.push(`${pl.username} got ${pl.stocks[co] * diff} div.`); }
        else if (diff < 0 && pl.id !== p.id) { pl.cash += pl.stocks[co] * diff; newState.logs.push(`${pl.username} lost ${Math.abs(pl.stocks[co] * diff)}.`); }
      }
    });
  });
  newState.currentDice = { company: null, zone: null }; return newState;
};
export const buyShares = (state: GameState, color: CompanyColor, amt: number): GameState => {
  if (!['Pre-Roll Buy/Sell', 'Post-Roll Buy/Sell'].includes(state.phase)) return state;
  const newState = JSON.parse(JSON.stringify(state)) as GameState; const p = newState.players[newState.turnIndex];
  if (newState.companies[color].stockPrice >= 1000 && p.cash >= newState.companies[color].stockPrice * amt && amt <= 5) {
    p.cash -= newState.companies[color].stockPrice * amt; p.stocks[color] += amt; newState.logs.push(`${p.username} bought ${amt} ${color}.`);
  }
  return newState;
};
export const sellShares = (state: GameState, color: CompanyColor, amt: number): GameState => {
  if (!['Pre-Roll Buy/Sell', 'Post-Roll Buy/Sell'].includes(state.phase)) return state;
  const newState = JSON.parse(JSON.stringify(state)) as GameState; const p = newState.players[newState.turnIndex];
  if (p.stocks[color] >= amt) { p.cash += newState.companies[color].stockPrice * amt; p.stocks[color] -= amt; newState.logs.push(`${p.username} sold ${amt} ${color}.`); }
  return newState;
};
export const advancePhase = (state: GameState): GameState => {
  const newState = JSON.parse(JSON.stringify(state)) as GameState;
  if (newState.phase === 'Pre-Roll Buy/Sell') newState.phase = 'Roll & Place';
  else if (newState.phase === 'Roll & Place') newState.phase = 'Dividends & Losses';
  else if (newState.phase === 'Dividends & Losses') {
    newState.players.forEach(p => {
      while (p.cash < 0 && COLORS.some(c => p.stocks[c] > 0)) {
        const c = COLORS.find(co => p.stocks[co] > 0)!; p.stocks[c] -= 1;
        const v = Math.floor((newState.companies[c].stockPrice / 2) / 1000) * 1000; p.cash += v; newState.logs.push(`${p.username} sold ${c} for ${v}.`);
      }
    });
    newState.phase = 'Post-Roll Buy/Sell';
  } else if (newState.phase === 'Post-Roll Buy/Sell') {
    newState.phase = 'Pre-Roll Buy/Sell'; newState.turnIndex = (newState.turnIndex + 1) % newState.players.length; newState.logs.push(`Turn: ${newState.players[newState.turnIndex].username}`);
  }
  return newState;
};
