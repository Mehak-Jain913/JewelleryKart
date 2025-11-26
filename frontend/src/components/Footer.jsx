import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'

const Footer = () => {
  const footerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1'
            entry.target.style.transform = 'translateY(0)'
          }
        })
      },
      { threshold: 0.1 }
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current)
      }
    }
  }, [])

  return (
    <footer 
      ref={footerRef}
      className="mt-20 bg-[#000000] text-[#F5F5F5] animate-fade-in"
      style={{
        opacity: 0,
        transform: 'translateY(20px)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
      }}
    >
      <div className="container mx-auto px-6 py-12 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* About Us */}
        <div>
          <h3 className="text-2xl font-black text-[#D4AF37] mb-4 font-display">Jeweluxe</h3>
          <p className="text-sm text-[#F5F5F5] leading-relaxed">
            Elegance crafted with passion. We bring you the finest jewelry collections, 
            where every piece tells a story of timeless beauty and sophistication.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-[#D4AF37] mb-4 text-lg">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/" 
                className="text-sm text-[#F5F5F5] hover:text-[#D4AF37] transition-colors duration-300 block"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/products" 
                className="text-sm text-[#F5F5F5] hover:text-[#D4AF37] transition-colors duration-300 block"
              >
                Products
              </Link>
            </li>
            <li>
              <Link 
                to="/wishlist" 
                className="text-sm text-[#F5F5F5] hover:text-[#D4AF37] transition-colors duration-300 block"
              >
                Wishlist
              </Link>
            </li>
            <li>
              <Link 
                to="/cart" 
                className="text-sm text-[#F5F5F5] hover:text-[#D4AF37] transition-colors duration-300 block"
              >
                Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-[#D4AF37] mb-4 text-lg">Contact</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a 
                href="mailto:mehakj536@gmail.com" 
                className="text-sm text-[#F5F5F5] hover:text-[#D4AF37] transition-colors duration-300"
              >
                mehakj536@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a 
                href="tel:+15551234567" 
                className="text-sm text-[#F5F5F5] hover:text-[#D4AF37] transition-colors duration-300"
              >
                +1 (555) 123-4567
              </a>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="font-semibold text-[#D4AF37] mb-4 text-lg">Follow Us</h4>
          <div className="flex gap-4">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#000000] transition-all duration-300"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#000000] transition-all duration-300"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a 
              href="https://x.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#000000] transition-all duration-300"
              aria-label="X (Twitter)"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-[#D4AF37]/20 mt-8 pt-6 pb-6">
        <div className="text-center text-sm text-[#F5F5F5]">
          © 2025 Jeweluxe. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer




