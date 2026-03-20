import { useEffect, useState } from 'react'; import { useParams } from 'react-router-dom'; import { io, Socket } from 'socket.io-client'; import { useStore } from '../store/useStore';
import { Board } from '../components/Board'; import { PlayerDashboard } from '../components/PlayerDashboard'; import { MarketDashboard } from '../components/MarketDashboard'; import { ActionPanel } from '../components/ActionPanel';

export const Game = () => {
  const { id } = useParams<{ id: string }>(); const { user } = useStore(); const [socket, setSocket] = useState<Socket | null>(null); const [gameState, setGameState] = useState<any>(null);
  useEffect(() => {
    if (!user || !id) return;
    const newSocket = io('http://localhost:3001'); setSocket(newSocket);
    newSocket.on('connect', () => newSocket.emit('join_game', { gameId: parseInt(id), userId: user.id }));
    newSocket.on('game_state_update', setGameState); return () => { newSocket.disconnect(); };
  }, [id, user]);

  if (!gameState) return <div className="flex items-center justify-center min-h-screen text-2xl font-bold text-gray-400">Loading Game...</div>;

  const currentPlayer = gameState.players[gameState.turnIndex]; const isMyTurn = currentPlayer?.id === user?.id;
  const handleCellClick = (r: number, c: number) => {
    if (!isMyTurn || gameState.phase !== 'Roll & Place' || !gameState.currentDice.zone) return;
    let color = gameState.currentDice.company;
    if (color === 'black' || color === 'white') color = prompt("Wildcard! Enter color (red, blue, green, yellow):") || 'red';
    socket?.emit('perform_action', { gameId: parseInt(id!), userId: user!.id, action: 'place_building', payload: { row: r, col: c, color } });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 font-sans">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-black text-blue-400">SHARK</h1><div className="text-xl font-bold bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">Room: {id}</div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-8">
          <div className="flex flex-wrap justify-center bg-gray-900 rounded-xl p-4 border border-gray-700 shadow-lg">
            {gameState.players.map((p: any, idx: number) => <PlayerDashboard key={p.id} player={{ ...p, isCurrentTurn: idx === gameState.turnIndex }} />)}
          </div>
          <div className="flex justify-center flex-grow"><Board boardState={gameState.board} onCellClick={handleCellClick} /></div>
        </div>
        <div className="w-full lg:w-96 flex flex-col gap-6">
          <ActionPanel phase={gameState.phase} isMyTurn={isMyTurn} dice={gameState.currentDice}
            onRoll={() => socket?.emit('perform_action', { gameId: parseInt(id!), userId: user!.id, action: 'roll_dice', payload: {} })}
            onEndPhase={() => socket?.emit('perform_action', { gameId: parseInt(id!), userId: user!.id, action: 'end_phase', payload: {} })}
            onBuy={(color: any, amount: any) => socket?.emit('perform_action', { gameId: parseInt(id!), userId: user!.id, action: 'buy_shares', payload: { color, amount } })}
            onSell={(color: any, amount: any) => socket?.emit('perform_action', { gameId: parseInt(id!), userId: user!.id, action: 'sell_shares', payload: { color, amount } })}
          />
          <MarketDashboard companies={gameState.companies} />
        </div>
      </div>
    </div>
  );
};
