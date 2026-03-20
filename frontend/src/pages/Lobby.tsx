import { useEffect, useState } from 'react'; import { useNavigate } from 'react-router-dom'; import { useStore } from '../store/useStore';
export const Lobby = () => {
  const [games, setGames] = useState<any[]>([]); const [leaderboard, setLeaderboard] = useState<any[]>([]); const { token, logout } = useStore(); const navigate = useNavigate();
  useEffect(() => {
    fetch(`http://localhost:3001/api/games/lobbies`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok && r.json()).then(setGames);
    fetch(`http://localhost:3001/api/games/leaderboard`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok && r.json()).then(setLeaderboard);
  }, [token]);
  const handleCreateGame = async () => {
    const res = await fetch(`http://localhost:3001/api/games/lobbies`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) { const game = await res.json(); navigate(`/game/${game.id}`); }
  };
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-4xl font-bold text-blue-400">Shark Lobby</h1>
        <button onClick={() => { logout(); navigate('/'); }} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Logout</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Active Games</h2><button onClick={handleCreateGame} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">Create Game</button>
          </div>
          {games.length === 0 ? <p className="text-gray-400">No active games.</p> : (
            <ul className="space-y-2">
              {games.map(g => (
                <li key={g.id} className="p-4 bg-gray-800 rounded flex justify-between items-center border border-gray-700">
                  <span>Game #{g.id} ({g.status})</span><button onClick={() => navigate(`/game/${g.id}`)} className="bg-blue-600 px-4 py-2 rounded">Join</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
          <div className="bg-gray-800 rounded overflow-hidden border border-gray-700">
            <table className="w-full text-left"><thead className="bg-gray-700"><tr><th className="p-3">Player</th><th className="p-3">Wins</th><th className="p-3">High Score</th></tr></thead>
              <tbody>{leaderboard?.map((lb, i) => (<tr key={i} className="border-t border-gray-700"><td className="p-3">{lb.username}</td><td className="p-3">{lb.total_wins}</td><td className="p-3">${lb.highest_net_worth}</td></tr>))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
