import './styles.css';
const Contact = () => {
  return (
    <div className='Contact'>
    <section className="container mt-4">
        <h2>Contact Information</h2>
        <p>If you have any questions or need assistance, feel free to contact us.</p>
        <address>
            Email: <a href="mailto:contact@yourmarket.com">contact@yourmarket.com</a><br/>
            Phone: +1-123-456-7890<br/>
            Address: 123 Supermarket St, Cityville, USA
        </address>
    </section>
    
    <footer className="bg-dark text-white text-center py-3">
        <p>&copy; 2023 Bryce Market. All rights reserved.</p>
    </footer>
    </div>
  )
}

export default Contact