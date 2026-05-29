import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { UnsubscribePage } from '../pages/UnsubscribePage';
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
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { AdminSiteSettingsPage } from '../pages/Admin/AdminSiteSettingsPage';
import { AdminAlbumsPage } from '../pages/Admin/AdminAlbumsPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unsubscribe" element={<UnsubscribePage />} />

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
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
       <Route path="/reset-password" element={<ResetPasswordPage />} />
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
          <Route path="/admin/albums" element={<AdminAlbumsPage />} />
          <Route path="/admin/song-proposals" element={<AdminSongProposalsPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/newsletter" element={<AdminNewsletterPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/site-settings" element={<AdminSiteSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}