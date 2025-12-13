import { Route, Routes, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function Nav() {
  const { user, logout } = useAuth();
  return (
    <nav className="flex items-center justify-between bg-white shadow px-4 py-3 mb-4">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="font-semibold text-pink-600">Sweet Shop</Link>
        {user && <span className="text-sm text-gray-600">Logged in as {user.username} ({user.role})</span>}
      </div>
      <div className="flex gap-3 text-sm">
        {!user && <Link to="/login" className="text-pink-600">Login</Link>}
        {!user && <Link to="/register" className="text-pink-600">Register</Link>}
        {user && <button onClick={logout} className="text-pink-600">Logout</button>}
        {user?.role === 'admin' && <Link to="/admin" className="text-pink-600">Admin</Link>}
      </div>
    </nav>
  );
}

function App() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      <main className="max-w-4xl mx-auto px-4">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminPanel /></ProtectedRoute>} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
