import { useAppSelector } from './app/hooks';
import { is_user_logged } from './components/login/loginSlice';
import './styles.css';
import { NavLink, Outlet } from 'react-router-dom';

function App() {
  const logged = useAppSelector(is_user_logged);
  return (
    <div className="App">
      <div className="content">
        <h1>Welcome to Our Supermarket</h1>

        <section className="container mt-4">
          <h2>About Us</h2>
          <p>Welcome to our supermarket! We offer a wide range of products to meet your everyday needs. Shop with us for quality, convenience, and unmatched customer service.</p>
        </section>

        <section className="container mt-4">
          <h2>Latest Offers</h2>
          <p>Check out our latest offers and discounts on various products. Don't miss out on great deals and seasonal specials!</p>
        </section>

        <section className="container mt-4">
          <h2>Customer Favorites</h2>
          <p>Explore our most popular items, handpicked by our loyal customers. From fresh produce to household essentials, find what you need with ease.</p>
        </section>

        <section className="container mt-4">
          <h2>Testimonials</h2>
          <p>Don't just take our word for it - hear from our happy customers! Our commitment to quality and service has earned us a trusted place in the community.</p>
        </section>

        <section className="container mt-4">
          <h2>Stay Updated</h2>
          <p>Sign up for our newsletter to get the latest news, exclusive offers, and more directly to your inbox.</p>
          {!logged ? (
            <div>
              <h3 className={`nav-item active`}>
                <NavLink to="/login" className="nav-link">
                  Login
                </NavLink>
              </h3>
              <h3 className={`nav-item active`}>
                <NavLink to="/register" className="nav-link">
                  Register
                </NavLink>
              </h3>
            </div>

          ) : (
            <></>
          )}
        </section>

        <section className="container mt-4">
          <h2>Gallery</h2>
          <p>Take a look at our wide array of products. From fresh produce to your favorite snacks, we've got it all!</p>
          {/* Add image gallery or carousel here */}
        </section>
      </div>

      <footer className="footer bg-dark text-white text-center py-3">
        <p>&copy; 2023 Bryce Market. All rights reserved.</p>
      </footer>
      <Outlet />
    </div>
  );
}

export default App;
