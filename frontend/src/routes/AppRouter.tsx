import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { AdminDashboardPage } from '../pages/Admin/AdminDashboardPage';
import { AdminGigsPage } from '../pages/Admin/AdminGigsPage';
import { AdminSongsPage } from '../pages/Admin/AdminSongsPage';
import { AdminSongProposalsPage } from '../pages/Admin/AdminSongProposalsPage';
import { AdminMembersPage } from '../pages/Admin/AdminMembersPage';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminUsersPage } from '../pages/Admin/AdminUsersPage';
import { AdminNewsletterPage } from '../pages/Admin/AdminNewsletterPage';
import { ShopPage } from '../pages/ShopPage';
import { AdminProductsPage } from '../pages/Admin/AdminProductsPage';

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
          path="/shop"
          element={
            <PublicLayout>
              <ShopPage />
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
          <Route path="/admin/members" element={<AdminMembersPage />} />
          <Route path="/admin/gigs" element={<AdminGigsPage />} />
          <Route path="/admin/songs" element={<AdminSongsPage />} />
          <Route path="/admin/song-proposals" element={<AdminSongProposalsPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/newsletter" element={<AdminNewsletterPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}