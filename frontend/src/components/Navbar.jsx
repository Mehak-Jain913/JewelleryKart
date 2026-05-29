import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const Navbar = () => {
  const { user, logout } = useAuth()
  const linkBase = 'px-3 py-2 text-sm font-semibold transition-colors border-b-2 border-transparent';
  const active = 'text-[#D4AF37] border-[#D4AF37]';
  const inactive = 'text-[#F5F5F5] hover:text-[#D4AF37] hover:border-[#D4AF37]';

  return (
    <header className="sticky top-0 z-50 bg-[#000000]">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black text-[#D4AF37] font-display">Jeweluxe</Link>
        <nav className="flex items-center gap-4">
          <NavLink to="/" end className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>
            Home
          </NavLink>
          <NavLink to="/products" className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>
            Products
          </NavLink>
          {user && (
            <>
              <NavLink to="/wishlist" className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>
                Wishlist
              </NavLink>
              <NavLink to="/orders" className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>
                Orders
              </NavLink>
            </>
          )}
          {/* IMPROVED: Check role and admin email dynamically */}
          {user && user.role === 'admin' && (!import.meta.env.VITE_ADMIN_EMAIL || user.email === import.meta.env.VITE_ADMIN_EMAIL) && (
            <>
              <NavLink to="/admin" className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>
                Admin
              </NavLink>
              <NavLink to="/admin-dashboard" className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>
                Dashboard
              </NavLink>
            </>
          )}
          <NavLink to="/cart" className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>
            Cart
          </NavLink>
          {!user ? (
            <NavLink to="/auth" className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>
              Login
            </NavLink>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/profile" className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>
                Profile
              </NavLink>
              <button onClick={logout} className={`${linkBase} ${inactive}`}>Logout</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
