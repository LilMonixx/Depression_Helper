import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx'; // <-- IMPORT MỚI
import './index.css';

function App() {
  return (
    <Routes>
      {/* --- Route được bảo vệ --- */}
      <Route element={<ProtectedRoute />}>
        {/* Chỉ người đã đăng nhập mới vào được đây */}
        <Route path="/" element={<HomePage />} />
        {/* (Sau này bạn có thể thêm các route khác cần bảo vệ ở đây) */}
      </Route>

      {/* --- Route công khai --- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;