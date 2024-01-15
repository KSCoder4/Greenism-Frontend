
import axios from 'axios';

const chatapi = {};

chatapi.getMessagesFromGroup = async function(roomid, page) {
	try {
		const messages = await axios.get('https://greenism-backend.onrender.com/chat/getmessages', {params: {
			username: sessionStorage.getItem('username'),
			roomid: roomid,
			page: page
		}});
		
		return messages.data.reverse();
	} catch(error) {
		if (error.response) {
			alert(error.response.data.message);
		} else {
			alert("Could not reach the server.");
		}
	}
};

chatapi.getGroupsFromUser = async function() {
	try {
		const groups = await axios.get("https://greenism-backend.onrender.com/chat/getgroups", {params: {
			username: sessionStorage.getItem('username')
		}});
	
		return groups.data;
	} catch(error) {
		if (error.response) {
			alert(error.response.data.message);
		} else {
			alert("Could not reach the server.");
		}
	}
};

chatapi.createGroup = async function(name) {
	if (name === "") {
		alert("Group name cannot be empty!");
		return;
	}

	try {
		const response = await axios.post("https://greenism-backend.onrender.com/chat/creategroup", {
			"Username": sessionStorage.getItem('username'),
			"Room Name": name
		});

		return response.data.roomid;
	} catch(error) {
		if (error.response) {
			alert(error.response.data.message);
		} else {
			alert("Could not reach the server.");
		}
	}
};

chatapi.leaveGroup = async function(id) {
	if (id === "") {
		alert("Group cannot be empty!");
		return;
	}

	try {
		const response = await axios.post("https://greenism-backend.onrender.com/chat/leavegroup", {
			"Username": sessionStorage.getItem('username'),
			"Room Id": id
		});
		
		return response.data.message;
	} catch(error) {
		if (error.response) {
			alert(error.response.data.message);
		} else {
			alert("Could not reach the server.");
		}
	}
};

chatapi.deleteGroup = async function(id) {
	if (id === "") {
		alert("Group cannot be empty!");
		return;
	}

	try {
		const response = await axios.post("https://greenism-backend.onrender.com/chat/removegroup", {
			"Username": sessionStorage.getItem('username'),
			"Room Id": id
		});
		
		return response.data.message;
	} catch(error) {
		if (error.response) {
			alert(error.response.data.message);
		} else {
			alert("Could not reach the server.");
		}
	}
};

chatapi.addPersonToGroup = async function(newusername, id) {
	if (id === "" || newusername === "") {
		alert("Cannot be empty!");
		return;
	}

	try {
		const response = await axios.post("https://greenism-backend.onrender.com/chat/addusertogroup", {
			"Username": sessionStorage.getItem('username'),
			"Room Id": id,
			"New User": newusername
		});
		
		return response.data.message;
	} catch(error) {
		if (error.response) {
			alert(error.response.data.message);
		} else {
			alert("Could not reach the server.");
		}
	}
};

chatapi.removePersonFromGroup = async function(removeusername, id) {
	if (id === "" || removeusername === "") {
		alert("Cannot be empty!");
		return;
	}

	try {
		const response = await axios.post("https://greenism-backend.onrender.com/chat/removeuserfromgroup", {
			"Username": sessionStorage.getItem('username'),
			"Room Id": id,
			"Remove User": removeusername
		});
		
		return response.data.message;
	} catch(error) {
		if (error.response) {
			alert(error.response.data.message);
		} else {
			alert("Could not reach the server.");
		}
	}
};

chatapi.addAdminToGroup = async function(adminusername, id) {
	if (id === "" || adminusername === "") {
		alert("Cannot be empty!");
		return;
	}

	try {
		const response = await axios.post("https://greenism-backend.onrender.com/chat/addadmin", {
			"Username": sessionStorage.getItem('username'),
			"Room Id": id,
			"Add User": adminusername
		});
		
		return response.data.message;
	} catch(error) {
		if (error.response) {
			alert(error.response.data.message);
		} else {
			alert("Could not reach the server.");
		}
	}
};

chatapi.removeAdminFromGroup = async function(adminusername, id) {
	if (id === "" || adminusername === "") {
		alert("Cannot be empty!");
		return;
	}

	try {
		const response = await axios.post("https://greenism-backend.onrender.com/chat/removeadmin", {
			"Username": sessionStorage.getItem('username'),
			"Room Id": id,
			"Remove User": adminusername
		});
		
		return response.data.message;
	} catch(error) {
		if (error.response) {
			alert(error.response.data.message);
		} else {
			alert("Could not reach the server.");
		}
	}
};

export default chatapi;
