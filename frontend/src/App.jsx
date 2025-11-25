import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import MoodPage from './pages/MoodPage.jsx';
import HealingLibraryPage from './pages/HealingLibraryPage.jsx';
import JournalPage from './pages/JournalPage.jsx';
import AdminPage from './pages/AdminPage.jsx'; // Trang Admin
import ProfilePage from './pages/ProfilePage.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx'; // Route bảo vệ Admin
import AppLayout from './components/AppLayout.jsx';
import { Toaster } from "@/components/ui/sonner";
import './index.css';

function App() {
  return (
    <>
      <Routes>
        {/* --- Route Công khai --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- Route Bảo vệ (Cần đăng nhập) --- */}
        <Route element={<ProtectedRoute />}>
          {/* Áp dụng Layout (có Menu) cho tất cả trang bên trong */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/mood" element={<MoodPage />} />
            <Route path="/library" element={<HealingLibraryPage />} />
            
            {/* --- Route Admin (Chỉ Admin mới vào được) --- */}
            <Route element={<AdminRoute />}>
               <Route path="/admin" element={<AdminPage />} />
            </Route>
            {/* -------------------------------------------- */}
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;