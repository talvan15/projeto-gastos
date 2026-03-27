import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ListaDespesas from './pages/ListaDespesas';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/despesas" element={<ListaDespesas />} />
      </Routes>
    </BrowserRouter>
  );
}
