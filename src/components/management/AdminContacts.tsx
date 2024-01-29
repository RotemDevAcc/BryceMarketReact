import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { get_user_token, is_user_logged } from '../login/loginSlice';
import { useAppSelector } from '../../app/hooks';
import { TargetServer } from '../settings/settings';
import { selectDarkMode } from '../settings/darkModeSlice';

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
}

const AdminContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useAppSelector(get_user_token);
  const logged = useAppSelector(is_user_logged);
  const isDarkMode = useAppSelector(selectDarkMode);

  useEffect(() => {
    if(!logged) return;
    axios.get(`${TargetServer}contact/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.data && response.data.data) {
        setContacts(response.data.data);
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching contact forms:', error);
      setLoading(false);
    });
  }, [logged, token]);

  const deleteContact = (id:number) => {
    axios.delete(`${TargetServer}contact/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      setContacts(contacts.filter((contact) => contact.id !== id));
    })
    .catch((error) => {
      console.error('Error deleting contact:', error);
    });
  };

  return (
    <Container className={`mt-4 ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <h2 className={`text-${isDarkMode ? 'white' : 'dark'}`}>Contact Forms (Admin)</h2>
      {loading ? (
        <p className={`text-${isDarkMode ? 'white' : 'dark'}`}>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className={`text-${isDarkMode ? 'white' : 'dark'}`}>Name</th>
              <th className={`text-${isDarkMode ? 'white' : 'dark'}`}>Email</th>
              <th className={`text-${isDarkMode ? 'white' : 'dark'}`}>Message</th>
              <th className={`text-${isDarkMode ? 'white' : 'dark'}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td className={`text-${isDarkMode ? 'white' : 'dark'}`}>{contact.name}</td>
                <td className={`text-${isDarkMode ? 'white' : 'dark'}`}>{contact.email}</td>
                <td className={`text-${isDarkMode ? 'white' : 'dark'} contact-message`}>{contact.message}</td>
                <td className={`text-${isDarkMode ? 'white' : 'dark'}`}>
                  <Button variant="danger" onClick={() => deleteContact(contact.id)}>X</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminContacts;
