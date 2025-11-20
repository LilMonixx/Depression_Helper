import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import JournalPage from './pages/JournalPage.jsx'; // <-- IMPORT MỚI
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import MoodPage from './pages/MoodPage.jsx';
import HealingLibraryPage from './pages/HealingLibraryPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppLayout from './components/AppLayout.jsx';
import { Toaster } from "@/components/ui/sonner"; 
import './index.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/journal" element={<JournalPage />} /> {/* <-- ROUTE MỚI */}
            <Route path="/mood" element={<MoodPage />} />
            <Route path="/library" element={<HealingLibraryPage />} />
          </Route>
        </Route>
      </Routes>
      <Toaster /> 
    </>
  );
}

export default App;