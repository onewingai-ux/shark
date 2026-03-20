import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home'; import { Lobby } from './pages/Lobby'; import { Game } from './pages/Game';
import { useStore } from './store/useStore';
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useStore((state) => state.token); return token ? <>{children}</> : <Navigate to="/" replace />;
}
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobby" element={<ProtectedRoute><Lobby /></ProtectedRoute>} />
          <Route path="/game/:id" element={<ProtectedRoute><Game /></ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
