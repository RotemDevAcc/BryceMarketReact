import './styles.css';
import React, { useState } from 'react';
import { useAppSelector } from './app/hooks';
import { is_user_logged } from './components/login/loginSlice';
import { get_user_token } from './components/login/loginSlice';
import { TargetServer } from './components/settings/settings';
import axios from 'axios';
import { Message } from './Message';
import { useNavigate } from 'react-router-dom';


const Contact = () => {
  const token = useAppSelector(get_user_token);
  const logged = useAppSelector(is_user_logged);
  const [message, setMessage] = useState('');
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = () => {
    // Check if the user is logged in and has a token
    if (logged && token) {
      // Check if the message is valid
      if (message.length < 10) {
        // Handle a message that is too short (less than 10 characters)
        Message("Message is too short (minimum 10 characters)", "error");
        return; // Exit the function without making the API request
      } else if (message.length > 700) {
        // Handle a message that is too long (more than 700 characters)
        Message("Message is too long (maximum 700 characters)", "error");
        return; // Exit the function without making the API request
      }
  
      // Make an API request to your Django app to send the message
      // You can use a library like Axios or fetch to make the request
      // Here's a simplified example using fetch:
      axios
        .post(`${TargetServer}contact/`, { message }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 201) {
            // Handle success, e.g., show a confirmation message
            Message("Message sent successfully", "success");
            setMessage('')
            navigate("/");
          } else {
            // Handle errors, e.g., display an error message
            Message("Failed to send the message", "error");
            console.error('Failed to send message');
          }
        })
        .catch((error) => {
          // Handle network errors
          console.error('Network error:', error);
        });
    }
  };
  

  return (
    <div className="Contact">
      <section className="container mt-4">
        <h2>Contact Information</h2>
        <p>If you have any questions or need assistance, feel free to contact us.</p>
        <address>
          Email: <a href="mailto:contact@brycemarket.com">contact@brycemarket.com</a><br />
          Phone: +1-123-456-7890<br />
          Address: 123 Supermarket St, Cityville, USA
        </address>
      </section>

      {logged ? (
        <section className="container mt-4">
          <h3>Or Simply send us a message</h3>
          <h2>Message Form</h2>
          <textarea
            className="form-control" // Apply Bootstrap's form-control class
            rows={4} // You can adjust the number of rows as needed
            placeholder="Enter your message"
            value={message}
            onChange={handleInputChange}
          />
          <button
            className="btn btn-primary mt-2" // Apply Bootstrap's btn and btn-primary classes
            onClick={handleSubmit}
          >
            Send
          </button>
        </section>
      ) : (<><h3 style={{color: "#FF0000"}}> You can only send contact messages after logging in</h3></>)}
    </div>
  );
};

export default Contact;
