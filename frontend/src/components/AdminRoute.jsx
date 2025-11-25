import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  
  // Nếu có userInfo VÀ userInfo.isAdmin là true thì cho qua (Outlet)
  // Ngược lại đá về trang chủ
  return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;