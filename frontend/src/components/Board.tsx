import React from 'react';
interface BoardProps { boardState: Array<Array<{ zone: number | 'S'; building: string | null }>>; onCellClick: (r: number, c: number) => void; }
export const Board: React.FC<BoardProps> = ({ boardState, onCellClick }) => {
  const getZoneColor = (zone: number | 'S') => zone === 1 ? 'bg-gray-800' : zone === 2 ? 'bg-gray-700' : zone === 3 ? 'bg-gray-800' : zone === 4 ? 'bg-gray-700' : 'bg-blue-900';
  const getBuildingStyle = (color: string) => color === 'red' ? 'bg-red-500' : color === 'blue' ? 'bg-blue-500' : color === 'green' ? 'bg-green-500' : color === 'yellow' ? 'bg-yellow-400' : color === 'black' ? 'bg-black' : 'bg-white';
  return (
    <div className="grid bg-gray-900 p-2 rounded shadow-2xl gap-[2px] border-4 border-gray-700" style={{ gridTemplateColumns: `repeat(${boardState[0]?.length || 12}, 1fr)` }}>
      {boardState.map((row, rIndex) => row.map((cell, cIndex) => (
        <div key={`${rIndex}-${cIndex}`} onClick={() => !cell.building && onCellClick(rIndex, cIndex)}
          className={`w-8 h-8 md:w-12 md:h-12 border flex items-center justify-center ${getZoneColor(cell.zone)} ${!cell.building ? 'hover:bg-opacity-80 cursor-pointer' : 'cursor-not-allowed'}`}>
          {cell.building && <div className={`w-6 h-6 md:w-10 md:h-10 rounded ${getBuildingStyle(cell.building)}`}></div>}
          {!cell.building && cell.zone === 'S' && <span className="text-blue-300 opacity-20">S</span>}
        </div>
      )))}
    </div>
  );
};
