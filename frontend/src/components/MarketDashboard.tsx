import React from 'react';
export const MarketDashboard: React.FC<{ companies: any }> = ({ companies }) => (
  <div className="bg-gray-800 p-6 rounded-lg w-full max-w-sm"><h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Market</h2><div className="space-y-4">{Object.entries(companies).map(([c, d]: any) => (
    <div key={c} className="flex justify-between bg-gray-900 p-3 rounded-lg"><div className="flex items-center"><div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: c === 'yellow' ? '#facc15' : c }}></div><span className="capitalize">{c}</span></div>
    <div className="flex flex-col items-end"><span className="text-green-400 font-bold">${d.stockPrice}</span><span className="text-xs text-gray-500">{d.availableBuildings} left</span></div></div>
  ))}</div></div>
);
