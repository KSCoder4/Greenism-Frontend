import React, { useEffect, useRef } from "react";
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { api } from './api.js';

function Log() {

	const userRef = useRef(null);
	const passRef = useRef(null);
	
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
		
    if (userRef.current.value === "" || passRef.current.value === "") {
      alert("Please fill in all fields");
    } else if (userRef.current.value.length > 100 || passRef.current.value.length > 100) {
      alert('Please shorten each of your input values to less than 100 characters');
    } else {
      const data = {
        Username: userRef.current.value,
        Password: passRef.current.value
      };
      
      axios.post('https://greenism-backend.onrender.com/checklogin', data)
        .then(response => {
					passRef.current.removeEventListener("keydown", handleEnter);
          api.loginUser();
          sessionStorage.setItem('username', userRef.current.value);
          if (sessionStorage.getItem("IsLoggedIn") === "true") {
            navigate('/userlist');
          }
        })
        .catch(error => {
          console.error('Failed to log in:', error);
          alert('Failed to log in. Please check your credentials and try again.');
        });
    }

    
  };

	const handleEnter = (event) => {
		if (event.key === "Enter" || event.keyCode === 13) {
			handleSubmit();
		}
	};

	useEffect(() => {
		var passAlias = passRef.current;
		setTimeout(() => {
			passRef.current.addEventListener("keydown", handleEnter);
			passAlias = passRef.current;
		}, 100);
		return (() => {
			passAlias.removeEventListener("keydown", handleEnter);
		});
	});

  return (
    <div className='main'>
      <div className='login-container'>
        <h1>Log In Page</h1>
        <div className='row'>
          <label htmlFor="username">Username:</label>
          <input
            autoFocus
            type="text"
            id="username"
            placeholder='Enter Username:'
						ref={userRef}
          />
        </div>
        <div className='row'>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder='Enter Password:'
						ref={passRef}
          />
        </div>
        <div className='row'>
          <Button onClick={handleSubmit} variant="warning">Log In</Button>
        </div>
      </div>
    </div>
  );
}

export default Log;
