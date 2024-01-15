import './Sign.css';
import React, { useState } from "react";
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Sign() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameCheckError, setUsernameCheckError] = useState('');
  const navigate = useNavigate();

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setUsernameCheckError(''); // Reset the username check error when the input changes
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUsernameBlur = () => {
    if (username !== '') {
      axios.post('https://greenism-backend.onrender.com/checkusername', { Username: username })
        .then(response => {
          const isDuplicate = response.data.isDuplicate;
          if (isDuplicate) {
            setUsernameCheckError('Username already exists. Please choose a different username.');
          }
        })
        .catch(error => {
          console.error('Failed to check username:', error);
          setUsernameCheckError('Failed to check username. Please try again.');
        });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setUsernameError('');
    setPasswordError('');
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setUsernameCheckError('');

    let isValid = true;

    if (username === "") {
      setUsernameError('Please enter a username');
      isValid = false;
    }

    if (password === "") {
      setPasswordError('Please enter a password');
      isValid = false;
    }

    if (firstName === "") {
      setFirstNameError('Please enter your first name');
      isValid = false;
    }

    if (lastName === "") {
      setLastNameError('Please enter your last name');
      isValid = false;
    }

    if (email === "") {
      setEmailError('Please enter an email address');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (isValid) {
      axios.post('https://greenism-backend.onrender.com/checkusername', { Username: username })
        .then(response => {
          const isDuplicate = response.data.isDuplicate;
          if (isDuplicate) {
            setUsernameCheckError('Username already exists. Please choose a different username.');
          } else {
            const data = {
              "Username": username,
              "Password": password,
              "First Name": firstName,
              "Last Name": lastName,
              "Email": email
            };

            axios.post('https://greenism-backend.onrender.com/createuser', data)
            .then(response => {
              console.log('User created successfully:', response.data);
              navigate('/log')
            })
            .catch(error => {
              console.error('Failed to create user:', error);
              alert('Failed to create user. Please try again.');
            });
          }
        })
        .catch(error => {
          console.error('Failed to check username:', error);
          alert('Failed to check username. Please try again.');
        });
    }
  };



  return (
    <div className='main'>
      <div className='sign-container'>
        <h1>Sign Up Page</h1>
        <div className='row'>
          <label>Username:</label>
          <input
            autoFocus
            type="text"
            id="username"
            placeholder='Enter Username:'
            value={username}
            onChange={handleUsernameChange}
            onBlur={handleUsernameBlur}
            required
            className={(usernameError || usernameCheckError) ? 'error' : ''}
          />
          {(usernameError || usernameCheckError) && <div className='error-message'>
            {usernameError || usernameCheckError}
          </div>}
        </div>
        <div className='row'>
          <label>Password:</label>
          <input
            type="password"
            id="password"
            placeholder='Enter Password:'
            value={password}
            onChange={handlePasswordChange}
            required
            className={passwordError ? 'error' : ''}
          />
          {passwordError && <div className='error-message'>{passwordError}</div>}
        </div>
        <div className='row'>
          <label>First Name:</label>
          <input
            type="text"
            id="firstname"
            placeholder='Enter First Name:'
            value={firstName}
            onChange={handleFirstNameChange}
            required
            className={firstNameError ? 'error' : ''}
          />
          {firstNameError && <div className='error-message'>{firstNameError}</div>}
        </div>
        <div className='row'>
          <label>Last Name:</label>
          <input
            type="text"
            id="lastname"
            placeholder='Enter Last Name:'
            value={lastName}
            onChange={handleLastNameChange}
            required
            className={lastNameError ? 'error' : ''}
          />
          {lastNameError && <div className='error-message'>{lastNameError}</div>}
        </div>
        <div className='row'>
          <label>Email Address:</label>
          <input
            type="text"
            id="email"
            placeholder='Enter Email Address:'
            value={email}
            onChange={handleEmailChange}
            required
            className={emailError ? 'error' : ''}
          />
          {emailError && <div className='error-message'>{emailError}</div>}
        </div>
        <div className='row'>
          <Button onClick={handleSubmit} variant="warning">Sign Up</Button>
        </div>
      </div>
    </div>
  );
}

export default Sign;
