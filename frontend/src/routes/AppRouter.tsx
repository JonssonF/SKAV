import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/HomePage';
import { AlbumsPage } from '../pages/AlbumsPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/albums" element={<AlbumsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}