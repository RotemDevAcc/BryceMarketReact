import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import Login from './components/login/Login';
import DarkMode from './components/settings/DarkMode';
// End Components

// Other
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './Layout';
import Super from './components/supermarket/Super';
import Contact from './Contact';
import Profile from './Profile';
import Register from './components/login/Register';
import Adminproducts from './components/management/Adminproducts';
import Adminhome from './components/management/Adminhome';
import Receipts from './components/management/Receipts';
import Customers from './components/management/Customers';
import PasswordResetRequestForm from './components/passwordreset/PasswordResetRequestForm';
import PasswordResetForm from './components/passwordreset/PasswordResetForm';
import AdminContacts from './components/management/AdminContacts';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
        <BrowserRouter>
          <ToastContainer position="top-center" theme='dark' />
          <DarkMode/>
          <Routes>
          <Route
              path="/*"
              element={<Layout />}
            >
              <Route index element={<App />} />
              <Route path="super" element={<Super />} />
              <Route path="login" element={<Login />} />
              <Route path="passwordreset" element={<PasswordResetRequestForm />} />
              <Route path="reset-password/:userId/:token" element={<PasswordResetForm />} />
              <Route path="register" element={<Register />} />
              <Route path="contact" element={<Contact />} />
              <Route path="profile" element={<Profile />} />
              {/* Admin */}
              <Route path="admin" element={<Adminhome />} />
              <Route path="allproducts" element={<Adminproducts />} />
              <Route path="receipts" element={<Receipts />} />
              <Route path="admincontacts" element={<AdminContacts />} />
              <Route path="customers" element={<Customers />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </Provider>
  </React.StrictMode>
);