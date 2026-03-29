import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ListaLancamentos from './pages/ListaLancamentos';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/despesas" element={<ListaLancamentos />} />
      </Routes>
    </BrowserRouter>
  );
}
