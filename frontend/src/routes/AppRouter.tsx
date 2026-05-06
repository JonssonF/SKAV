import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { AdminDashboardPage } from '../pages/Admin/AdminDashboardPage';
import { AdminGigsPage } from '../pages/Admin/AdminGigsPage';
import { AdminAlbumPage } from '../pages/Admin/AdminAlbumPage';
import { AdminSongsPage } from '../pages/Admin/AdminSongsPage';
import { AdminMembersPage } from '../pages/Admin/AdminMembersPage';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminUsersPage } from '../pages/Admin/AdminUsersPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/albums" element={<AdminAlbumPage />} />
          <Route path="/admin/members" element={<AdminMembersPage />} />
          <Route path="/admin/gigs" element={<AdminGigsPage />} />
          <Route path="/admin/songs" element={<AdminSongsPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}