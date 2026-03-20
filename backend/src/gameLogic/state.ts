export type CompanyColor = 'red' | 'blue' | 'green' | 'yellow';
export interface CompanyState { color: CompanyColor; stockPrice: number; availableBuildings: number; }
export interface PlayerState { id: number | string; username: string; isAi: boolean; cash: number; stocks: Record<CompanyColor, number>; }
export type Phase = 'Pre-Roll Buy/Sell' | 'Roll & Place' | 'Dividends & Losses' | 'Post-Roll Buy/Sell';
export interface GameState {
  board: Array<Array<{ zone: number | 'S'; building: CompanyColor | null }>>;
  companies: Record<CompanyColor, CompanyState>; players: PlayerState[]; turnIndex: number; phase: Phase;
  currentDice: { company: CompanyColor | 'black' | 'white' | null; zone: number | 'S' | null }; logs: string[];
}
export const initialGameState = (): GameState => ({
  board: [[1,1,1,1,1,1,1,2,2,2,2,2,2],[1,1,1,1,1,1,1,2,2,2,2,2,2],[1,1,1,1,1,1,1,2,2,2,2,2,2],[1,1,1,1,'S','S','S','S',2,2,2,2],[1,1,1,'S','S','S','S','S','S',2,2,2],[1,1,1,'S','S','S','S','S','S',2,2,2],[3,3,3,'S','S','S','S','S','S',4,4,4],[3,3,3,'S','S','S','S','S','S',4,4,4],[3,3,3,3,'S','S','S','S',4,4,4,4],[3,3,3,3,3,3,4,4,4,4,4,4],[3,3,3,3,3,3,4,4,4,4,4,4],[3,3,3,3,3,3,4,4,4,4,4,4]].map(row => row.map(z => ({ zone: z as number | 'S', building: null }))),
  companies: { red: { color: 'red', stockPrice: 0, availableBuildings: 18 }, blue: { color: 'blue', stockPrice: 0, availableBuildings: 18 }, green: { color: 'green', stockPrice: 0, availableBuildings: 18 }, yellow: { color: 'yellow', stockPrice: 0, availableBuildings: 18 } },
  players: [], turnIndex: 0, phase: 'Pre-Roll Buy/Sell', currentDice: { company: null, zone: null }, logs: ['Game created'],
});
