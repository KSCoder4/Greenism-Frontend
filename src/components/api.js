import axios from 'axios';

function loginUser() {
    sessionStorage.setItem('IsLoggedIn', "true");
}
    
function logoutUser() {
    sessionStorage.setItem('IsLoggedIn', "false");
    sessionStorage.removeItem('username');
}

function deleteUser() {
	const username = sessionStorage.getItem('username');

  const data = {
    "Username": username,
  };
    
  axios.post('https://greenism-backend.onrender.com/deleteuser', data)
    .then(response => {
			sessionStorage.setItem('IsLoggedIn', "false");
    	sessionStorage.removeItem('username');
      alert('Deleted account successfully!');
    })
    .catch(error => {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account. Please try again.');
    });
}

function saveBobuxClicker(points, increment, autoinc, level, exp, exprequired, expmultiplier, autospeed, silence) {

    const username = sessionStorage.getItem('username')

    const data = {
        "Username": username,
        "Points": points,
        "Increment": increment,
        "Autoclicker Increment": autoinc,
        "Level": level,
        "Experience": exp,
        "Experience Required": exprequired,
        "Experience Multiplier": expmultiplier,
        "Autoclicker Speed": autospeed
    };
    
    axios.post('https://greenism-backend.onrender.com/bobux/saveclicker', data)
    	.then(response => {
				if (silence) {alert("Saved Game.");}
      })
      .catch(error => {
        console.error('Failed to save data:', error);
        alert('Failed to save data. Please try again.');
      });
}

async function getBobuxClicker() {
    const username = sessionStorage.getItem('username')
    return await axios.post('https://greenism-backend.onrender.com/bobux/getclicker', { Username: username });
}

function checkLoggedInStatus() {
    return sessionStorage.getItem('IsLoggedIn') === "true";
}

export const api = {loginUser, logoutUser, checkLoggedInStatus, getBobuxClicker, saveBobuxClicker, deleteUser};
