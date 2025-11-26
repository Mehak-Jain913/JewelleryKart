import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import Admin from './pages/Admin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Auth from './pages/Auth.jsx'
import Cart from './pages/Cart.jsx'
import Profile from './pages/Profile.jsx'
import Orders from './pages/Orders.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Footer from './components/Footer.jsx'
import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx'

function App() {
  const location = useLocation()
  const isAuthPage = location.pathname === '/auth'
  const isAdminPage = location.pathname === '/admin' || location.pathname === '/admin-dashboard'

  return (
    <div className="min-h-screen bg-white">
      {!isAuthPage && <Navbar />}
      <main className={isAuthPage ? '' : isAdminPage ? '' : 'container mx-auto px-6 py-10'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<ProtectedAdminRoute><Admin /></ProtectedAdminRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  )
}

export default App