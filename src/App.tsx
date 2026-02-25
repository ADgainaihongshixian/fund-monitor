import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FundPage from '@/pages/FundPage';
import PreciousMetalPage from '@/pages/PreciousMetalPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FundPage />} />
        <Route path="/fund" element={<FundPage />} />
        <Route path="/precious-metal" element={<PreciousMetalPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
