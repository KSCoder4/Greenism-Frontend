import { Container, NavDropdown, Offcanvas } from 'react-bootstrap';
import { useState } from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';
import { api } from './api.js';

function NavBar() {
  const [show, setShow] = useState(false);

  const closeSidebar = () => setShow(false);
  const showSidebar = () => {
    setShow(true);
  };

	const logout = () => {
		closeSidebar();
		api.logoutUser();
	};

  return (
    <>
      <Container className='p-4'>
        <div className='container' onClick={showSidebar}>
          <div className='bar1'></div>
          <div className='bar2'></div>
          <div className='bar3'></div>
        </div>
        <Offcanvas backdrop='false' show={show} onHide={closeSidebar}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="heading">Navigation</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <NavDropdown.Item className='navLink' as={Link} to='/' onClick={closeSidebar}>
              Home Page
            </NavDropdown.Item>
            <br />
            <NavDropdown.Item className='navLink' as={Link} to='/sign' onClick={closeSidebar}>
              Sign Up Page
            </NavDropdown.Item>
            <br />
            <NavDropdown.Item className='navLink' as={Link} to='/log' onClick={closeSidebar}>
              Log In Page
            </NavDropdown.Item>
            <br />
            {api.checkLoggedInStatus() ? (
              <NavDropdown.Item className='navLink' as={Link} to='/userlist' onClick={closeSidebar}>
                User List and Leaderboard
              </NavDropdown.Item>
            ) : null}
            <br/>
            {api.checkLoggedInStatus() ? (
              <NavDropdown.Item className='navLink' as={Link} to='/clicker' onClick={closeSidebar}>
                Bobux Clicker
              </NavDropdown.Item>
            ) : null}
						<br/>
						 {api.checkLoggedInStatus() ? (
              <NavDropdown.Item className='navLink' as={Link} to='/chat' onClick={closeSidebar}>
                Chat
              </NavDropdown.Item>
      
            ) : null}
						<br/> 
            {api.checkLoggedInStatus() ? (
            <NavDropdown.Item className='navLink' as={Link} to='/space' onClick={closeSidebar}>
              Space Exploration (In Progress)
            </NavDropdown.Item>
      ) : null}
            <br/>
						{api.checkLoggedInStatus() ? (
              <NavDropdown.Item className='navLink' as={Link} to='/settings' onClick={closeSidebar}>
                Preferences
              </NavDropdown.Item>
            ) : null}
						<br/>
						{api.checkLoggedInStatus() ? (
              <NavDropdown.Item className='navLink' as={Link} to='/log' onClick={logout}>
                Log Out
              </NavDropdown.Item>
            ) : null}
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </>
  );
}

export default NavBar;
