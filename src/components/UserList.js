import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserPagination from './UserPagination';
import './UserList.css';
import { suffixes } from "./suffixes.js";

function UserList() {
  const [page, setPage] = useState(1);
  const [usersData, setUsersData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('username');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    axios.get('https://greenism-backend.onrender.com/leaderboarddata')
      .then(response => {
        setUsersData(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch user data:', error);
      });
  }, []);

  const filteredUsers = usersData.filter(user =>
    (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.firstname && user.firstname.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.lastname && user.lastname.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const parseAbbreviatedNumber = (abbreviatedNumber) => {

    const numPart = parseFloat(abbreviatedNumber);
    const suffixPart = abbreviatedNumber.replace(/[\d.]/g, '');

    const magnitude = suffixes.indexOf(suffixPart);

    if (magnitude === -1 || suffixPart === "") {
      return numPart;
    } else {
      return numPart * Math.pow(1000, magnitude);
    }
  }


  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortColumn === 'points') {
      const aValue = parseAbbreviatedNumber(a[sortColumn]);
      const bValue = parseAbbreviatedNumber(b[sortColumn]);
      return (aValue - bValue) * (sortDirection === 'asc' ? 1 : -1);
    }

    const aValue = a[sortColumn].toLowerCase();
    const bValue = b[sortColumn].toLowerCase();
    return aValue.localeCompare(bValue) * (sortDirection === 'asc' ? 1 : -1);
  });

  const toggleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
	
  const usersPerPage = 10;
  const startIndex = (page - 1) * usersPerPage;
  const displayedUsers = sortedUsers.slice(startIndex, startIndex + usersPerPage);

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  return (
    <div className="container">
      <h1 className="h1">User List</h1><br></br>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by username, first name, or last name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      <p className='tableP'>Click on a bolded category name in the table to sort the table by that category. </p>
      {filteredUsers.length > 0 ? (
        <Table id="usertable" bordered hover size="sm" variant="light" responsive className="custom-table">
          <thead>
            <tr>
							<th>Place</th>
              <th onClick={() => toggleSort('username')}>
                Username
                {sortColumn === 'username' && (
                  <span className={`sort-arrow ${sortDirection === 'asc' ? 'asc' : 'desc'}`}></span>
                )}
              </th>
              <th onClick={() => toggleSort('firstname')}>
                First Name
                {sortColumn === 'firstname' && (
                  <span className={`sort-arrow ${sortDirection === 'asc' ? 'asc' : 'desc'}`}></span>
                )}
              </th>
              <th onClick={() => toggleSort('lastname')}>
                Last Name
                {sortColumn === 'lastname' && (
                  <span className={`sort-arrow ${sortDirection === 'asc' ? 'asc' : 'desc'}`}></span>
                )}
              </th>
              <th onClick={() => toggleSort('points')}>
                Bobux (Bobux Clicker)
                {sortColumn === 'points' && (
                  <span className={`sort-arrow ${sortDirection === 'asc' ? 'asc' : 'desc'}`}></span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
						{displayedUsers.map((user, index) => (
              <tr key={index}>
								<td>{index + startIndex + 1}</td>
                <td>{user.username}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.points}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p style={{ color: 'white', fontSize: 'larger' }}>No users available.</p>
      )}
      <UserPagination usernames={sortedUsers} page={page} setPage={setPage} />
    </div>
  );
}

export default UserList;
