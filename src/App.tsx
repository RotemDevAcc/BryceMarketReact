import './styles.css';
import { Outlet } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <div className="content">
      <h1>Welcome to Our Supermarket</h1>

        <section className="container mt-4">
          <h2>About Us</h2>
          <p>Welcome to our supermarket! We offer a wide range of products to meet your everyday needs. Shop with us for quality and convenience.</p>
        </section>

        <section className="container mt-4">
          <h2>Latest Offers</h2>
          <p>Check out our latest offers and discounts on various products. Don't miss out on great deals!</p>
        </section>
      </div>

      <footer className="bg-dark text-white text-center py-3">
        <p>&copy; 2023 Bryce Market. All rights reserved.</p>
      </footer>
      <Outlet />
    </div>
  );
}

export default App;
