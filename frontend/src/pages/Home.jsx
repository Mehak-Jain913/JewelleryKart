import { Link } from 'react-router-dom'

const categories = [
  { name: 'Rings', image: 'https://www.candere.com/media/jewellery/images/C004016__1.jpeg' },
  { name: 'Necklaces', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTamkI4APRGsuKiwcON-6t7V-EnQfXeRePRkg&s' },
  { name: 'Bracelets', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiQzyoMaZHUIIWDrFFoMRu9gKRHdj6syM5CQ&s' },
  { name: 'Earrings', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqlVHaJ63rXjOaB0s1cEuLpCzD_8_CuhMwfQ&s' },
]

const brands = ['Aurora', 'LuxeGem', 'Opaline', 'Stellar Gold', 'SilverLeaf']

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl">
        <img
          src="https://images-static.nykaa.com/media/catalog/product/6/5/65017a8nykpriy000907.jpg"
          alt="Jewellery Hero"
          className="w-full h-[420px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-[#D4AF37]/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="px-8 md:px-16">
            <h1 className="text-white text-4xl md:text-6xl font-black mb-4 drop-shadow font-display">Shine with Elegance — Discover Timeless Jewellery</h1>
            <p className="text-white/90 max-w-xl mb-6">Discover rings, necklaces, bracelets, and earrings crafted to perfection.</p>
            <Link to="/products" className="btn-gold">Shop Now</Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-3xl font-bold text-black mb-6">Shop by Category</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0,3).map(c => (
            <Link key={c.name} to={`/products?type=${encodeURIComponent(c.name.slice(0,-1).toLowerCase())}`} className="group block">
              <div className="relative overflow-hidden rounded-2xl">
                <img src={c.image} alt={c.name} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white font-semibold text-lg">{c.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials / Brands */}
      <section className="rounded-3xl border border-gray-200 p-8 bg-white">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-black font-display">Trusted by premium brands</h3>
          <p className="text-gray-600">Quality and craftsmanship recognized worldwide</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {brands.map(b => (
            <div key={b} className="px-4 py-2 border border-gray-200 rounded-full text-sm font-semibold text-gray-700">
              {b}
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-black font-display">Featured Products</h2>
          <Link to="/products" className="text-sm font-semibold underline">View all</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c, idx) => (
            <div key={idx} className="card-lux overflow-hidden">
              <img src={c.image} alt={c.name} className="w-full h-44 object-cover" />
              <div className="p-4">
                <div className="font-bold text-black">{c.name} Classic</div>
                <div className="text-sm text-gray-600">$ {199 + idx * 50}.00</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home


