import React from 'react';
interface PlayerProps { player: { username: string; cash: number; stocks: any; isCurrentTurn: boolean; }; }
export const PlayerDashboard: React.FC<PlayerProps> = ({ player }) => (
  <div className={`p-4 rounded-lg border-2 ${player.isCurrentTurn ? 'border-yellow-400 bg-gray-800' : 'border-gray-700 bg-gray-900'} w-64 m-2 flex flex-col`}>
    <div className="flex justify-between items-center mb-2"><h3 className="font-bold truncate">{player.username}</h3>{player.isCurrentTurn && <span className="text-yellow-400 text-xs">Turn</span>}</div>
    <div className="text-2xl font-black text-green-400 mb-4">${player.cash}</div>
    <div className="grid grid-cols-2 gap-2 text-sm">{['red', 'blue', 'green', 'yellow'].map(c => (
      <div key={c} className="flex justify-between bg-gray-800 p-2 rounded"><div className={`w-3 h-3 rounded bg-${c}-500`} style={{ backgroundColor: c === 'yellow' ? '#facc15' : c }}></div><span>{player.stocks[c]}</span></div>
    ))}</div>
  </div>
);
