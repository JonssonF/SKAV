import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/HomePage';
import { GigsPage } from '../pages/GigsPage';
import { MembersPage } from '../pages/MembersPage';
import { LoginPage } from '../pages/LoginPage';
import { AdminDashboardPage } from '../pages/Admin/AdminDashboardPage';
import { AdminGigsPage } from '../pages/Admin/AdminGigsPage';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminAlbumPage } from '../pages/Admin/AdminAlbumPage';
import { MusicPage } from '../pages/MusicPage';
import { AdminSongsPage } from '../pages/Admin/AdminSongsPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/gigs" element={<GigsPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/albums"
            element={
              <ProtectedRoute>
                <AdminAlbumPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/gigs"
            element={
              <ProtectedRoute>
                <AdminGigsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/songs"
            element={
                <ProtectedRoute>
                <AdminSongsPage />
                </ProtectedRoute>
            }
            />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}