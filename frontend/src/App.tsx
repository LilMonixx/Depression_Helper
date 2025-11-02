import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import MoodPage from './pages/MoodPage.tsx';
import { Toaster } from "@/components/ui/sonner"; 
import HealingLibraryPage from './pages/HealingLibraryPage.tsx';
import './index.css';

function App() {
  return (
    // Bọc mọi thứ trong một thẻ rỗng
    <>
      <Routes>
        {/* --- Route được bảo vệ --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/mood" element={<MoodPage />} />
          <Route path="/library" element={<HealingLibraryPage />} />
        </Route>

        {/* --- Route công khai --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <Toaster /> 
    </>
  );
}

export default App;