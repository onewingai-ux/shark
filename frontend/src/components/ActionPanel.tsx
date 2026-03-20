import React, { useState } from 'react';
export const ActionPanel: React.FC<any> = ({ phase, isMyTurn, dice, onRoll, onEndPhase, onBuy, onSell }) => {
  const [tradeColor, setTradeColor] = useState('red'); const [tradeAmount, setTradeAmount] = useState(1);
  if (!isMyTurn) return (<div className="bg-gray-800 p-6 rounded-lg text-center w-full max-w-md"><h2 className="text-2xl font-bold mb-2">Waiting</h2><p>Phase: {phase}</p></div>);
  return (
    <div className="bg-gray-800 p-6 rounded-lg border-2 border-yellow-500 w-full max-w-md"><h2 className="text-3xl font-black text-center text-yellow-400 mb-6">Your Turn</h2>
      <div className="bg-gray-900 p-3 mb-6 flex justify-between"><span>Phase</span><span className="font-bold">{phase}</span></div>
      {(phase === 'Pre-Roll Buy/Sell' || phase === 'Post-Roll Buy/Sell') && (
        <div className="space-y-4"><div className="flex space-x-2"><select value={tradeColor} onChange={e => setTradeColor(e.target.value)} className="bg-gray-700 rounded p-3 flex-grow"><option value="red">Red</option><option value="blue">Blue</option><option value="green">Green</option><option value="yellow">Yellow</option></select><input type="number" min="1" max="5" value={tradeAmount} onChange={e => setTradeAmount(Number(e.target.value))} className="w-20 bg-gray-700 text-center rounded p-3" /></div>
          <div className="flex space-x-2"><button onClick={() => onBuy(tradeColor, tradeAmount)} className="flex-1 bg-green-600 font-bold py-3 rounded">Buy</button><button onClick={() => onSell(tradeColor, tradeAmount)} className="flex-1 bg-red-600 font-bold py-3 rounded">Sell</button></div></div>
      )}
      {phase === 'Roll & Place' && (<div className="space-y-6">{!dice.company ? (<button onClick={onRoll} className="w-full bg-blue-600 font-black py-4 rounded-xl">ROLL DICE</button>) : (<div className="text-center p-6 bg-gray-900 rounded-xl"><p>Rolled</p><div className="flex justify-center space-x-4"><div className="bg-white text-black px-4 py-2 font-bold rounded">{dice.company?.toUpperCase()}</div><div>IN</div><div className="bg-gray-700 px-4 py-2 font-bold rounded">ZONE {dice.zone}</div></div></div>)}</div>)}
      <button onClick={onEndPhase} className="w-full mt-6 bg-gray-600 font-bold py-3 rounded">{phase === 'Post-Roll Buy/Sell' ? 'END TURN' : 'SKIP PHASE'}</button>
    </div>
  );
};
