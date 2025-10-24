import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Kiểm tra xem có token trong localStorage không
  const token = localStorage.getItem('token');

  // Nếu có token, cho phép truy cập (hiển thị <Outlet />)
  // Nếu không, điều hướng về trang /login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;