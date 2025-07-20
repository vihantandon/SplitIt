// src/pages/HandleInvite.jsx

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function HandleInvite() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem("userEmail");
    if (!isLoggedIn) {
      localStorage.setItem('pendingInviteToken', token);
      navigate('/signin');
    } else {
      axios.post('http://localhost:3000/api/invite/accept', { token , userEmail,})
        .then(() => {
          localStorage.removeItem('pendingInviteToken');
          navigate('/yourgroups');
        })
        .catch((err) => {
          console.error('Error accepting invite:', err);
          alert('Invalid or expired invite link.');
        });
    }
  }, [token, navigate]);

  return <div>Processing invite...</div>;
}

export default HandleInvite;
