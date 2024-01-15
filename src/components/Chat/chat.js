import './chat.css';
import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from "emoji-picker-react";
import Linkify from 'react-linkify';
import ChatWelcome from './ChatWelcome.js';
import chatapi from './api.js';
import { Button } from 'react-bootstrap';
import { io } from 'socket.io-client';

let socket;

let inputAlias;

function Chat() {
	const [messages, setMessages] = useState([]);
	const [groups, setGroups] = useState([]);

	const loadMessagesButton = useRef(null);
	const page = useRef(0);

	const messagesDiv = useRef(null);
	const chatInput = useRef(null);
	const sendButton = useRef(null);
	const sendTimeout = useRef(null);
	const emojiDialog = useRef(null);
	
	const createGroupDialog = useRef(null);
	const createGroupDialogName = useRef(null);

	const optionsGroupDialog = useRef(null);
	const optionsGroupDialogAddUser = useRef(null);
	const optionsGroupDialogRemoveUser = useRef(null);
	const optionsGroupDialogDeleteGroup = useRef(null);
	const optionsGroupDialogLeaveGroup = useRef(null);
	const optionsGroupDialogAddAdmin = useRef(null);
	const optionsGroupDialogRemoveAdmin = useRef(null);

	const addUserInput = useRef(null);
	const removeUserSelect = useRef(null);
	const addAdminInput = useRef(null);
	const removeAdminSelect = useRef(null);

	const socketRef = useRef(null);

	const iconState = useRef(false);
	
	const roomId = useRef("");

	const processAttachmentLinks = (message) => {
		var urlRegex = /(https?:\/\/[^\s]+)/g;
		var lastUrl;
  	message.replace(urlRegex, function(url) {
			lastUrl = url;
			console.log(url);
    	return url;
  	});

		if (!lastUrl) return;

		const urlObj = new URL(lastUrl);

		if (!(urlObj.pathname.endsWith("png") || urlObj.pathname.endsWith("jpeg") || urlObj.pathname.endsWith("jpg") || urlObj.pathname.endsWith("gif"))) return;
			
		return <img src={lastUrl} className="attachment" alt="" />;
	};

	const stringToColour = (str) => {
	  let hash = 0;
		
	  str.split('').forEach(char => {
	    hash = char.charCodeAt(0) + ((hash << 5) - hash);
	  })
		
	  let colour = '#';
		
	  for (let i = 0; i < 3; i++) {
	    const value = (hash >> (i * 8)) & 0xff;
	    colour += value.toString(16).padStart(2, '0');
	  }
		
	  return colour;
	};

	const loadNewPage = async () => {
		page.current++;
		const loadedMessages = await chatapi.getMessagesFromGroup(roomId.current, page.current);
		if (loadedMessages.length !== 0) {
			setMessages([...loadedMessages, ...messages]);
		} else {
			loadMessagesButton.style.display = "none";
		}
	};

	const groupOptions = () => {
		optionsGroupDialog.current.showModal();
	};

	const changeGroup = async (id) => {
		if (roomId.current == id) return;
		
		Notification.requestPermission((result) => {});
		
		page.current = 0;
		
		if (roomId.current === "") {
			socket.emit('joingroup', {username: sessionStorage.getItem('username'), roomid: id});
		} else {
			socket.emit('switchgroup', {oldroomid: roomId.current, newroomid: id});
		}
		
		roomId.current = id;
		await getMessages();

		setTimeout(function () {
			messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight;
			sendButton.current.onclick = sendMessage;
			chatInput.current.onkeydown = handleEnter;
			inputAlias = chatInput.current;
		}, 100);
	};

	const leaveGroup = async (id) => {
		socket.emit('leavegroup', {"roomid": id});
		socket.emit('usersmutated', {"roomid": id});
		await chatapi.leaveGroup(id);
		roomId.current = "";
		await getGroups();
	};

	const deleteGroup = async (id) => {
		await chatapi.deleteGroup(id);
		socket.emit('deletegroup', {roomid: id});
	};

	const setIcon = (state) => {
		let link = document.querySelector('link[rel="shortcut icon"]') || document.querySelector('link[rel="icon"]');

		if (!link) {
	    link = document.createElement('link');
	    link.id = 'favicon';
	    link.rel = 'shortcut icon';
	    document.head.appendChild(link);
		}

		iconState.current = state;

		if (state) {
			link.href = `https://greenism.the-green-team.repl.co/GreenismAlert.png`;
		} else {
			link.href = `https://greenism.the-green-team.repl.co/Greenism.png`;
		}
	};

	const connectWebsocket = () => {
		socket = io("https://greenism-backend.onrender.com/chat/ws", {rememberTransport: false});
		socketRef.current = socket;
		
		socket.on('receivedmessage', (chat) => {
      setMessages(messages => [...messages, JSON.parse(chat)]);
			
			if (JSON.parse(chat).sender != sessionStorage.getItem('username')) {
				setIcon(true);
				if (Notification.permission === "granted") {
					const img = "https://greenism.the-green-team.repl.co/Greenism.png";
					const text = `${JSON.parse(chat).sender} has sent a message in ${groups.filter((group) => {return group.roomid === roomId.current;})[0]}.`;
					new Notification("Greenism", { body: text, icon: img });
				}
			}
			
			setTimeout(function () {
				if (messagesDiv.current.scrollHeight - messagesDiv.current.scrollTop > 350) {
					messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight;
				}
			}, 200);
    });

		socket.on('receiveddelete' , () => {
			roomId.current = "";
			setTimeout(function () {
				getGroups();
			}, 500);
		});

		socket.on('receivedusersmutated', () => {
			console.log("mutated");
			setTimeout(function () {
				getGroups();
			}, 1000);
		});
	};

	const getGroups = async () => {
		setGroups(await chatapi.getGroupsFromUser());
	};

	const getMessages = async () => {
		setMessages(await chatapi.getMessagesFromGroup(roomId.current, page.current));
	};

	const appendEmoji = (emoji) => {
		chatInput.current.value += emoji.emoji;
	};

	const sendMessage = () => {
		if (!chatInput.current.value.trim() || chatInput.current.value.trim() == "") return;
		if (sendButton.current.disabled) return;
		if (chatInput.current.value.trim().length > 399) {
			alert("Message is too long!");
			return;
		}

		var pastMessage = "";
		var pastPastMessage = "";
		var inputValue = chatInput.current.value.trim();
		setMessages((s) => {
			pastMessage = s[s.length - 1];
			pastPastMessage = s[s.length - 2];
			if (pastMessage) pastMessage = pastMessage.message;
			if (pastPastMessage) pastPastMessage = pastMessage.message;
			return s;
		});

		setTimeout(function () {
			if (pastMessage == inputValue || pastPastMessage == inputValue) {
				alert("No duplicate messages!");
				return;
			}
			
			socket.emit('sendmessage', {message: inputValue, sender: sessionStorage.getItem('username'), roomid: roomId.current});
			chatInput.current.value = "";
			sendButton.current.disabled = true;
	
			sendTimeout.current = setTimeout(function () {
				sendButton.current.disabled = false;
			}, 4000);
		}, 100);
	};

	const handleEnter = (e) => {
		if (e.keyCode === 13 || e.key === "Enter") {
			sendMessage();
		}
	};

	const handleMouseMove = (e) => {
		if (iconState.current) setIcon(false);
	};

	const showEmojiPicker = () => {
		emojiDialog.current.showModal();
	}

	useEffect(() => {
		var socketAlias = socketRef.current;
		
		async function getChatData() {
			await getGroups();
			connectWebsocket();

			socketAlias = socketRef.current;
		}
		getChatData();

		window.addEventListener("mousemove", handleMouseMove);
		
		return (() => {
      socketAlias.disconnect();
			if (sendTimeout.current) clearTimeout(sendTimeout.current);
			window.removeEventListener("mousemove", handleMouseMove);
    });
	}, []);

	var currentGroup = groups.filter((group) => {
		return group.roomid === roomId.current;
	})[0];

	var isUserAdmin;
	var usersInGroup;
	var adminsInGroup;

	var renderedRemoveOptions;
	var renderedRemoveAdminOptions;
	
	if (currentGroup) {
		isUserAdmin = currentGroup.admins.includes(sessionStorage.getItem('username'));
		usersInGroup = currentGroup.users;
		adminsInGroup = currentGroup.admins;
		
		renderedRemoveOptions = usersInGroup.map((username) => {
			return <option key={username} value={username}>{username}</option>;
		});

		renderedRemoveAdminOptions = adminsInGroup.map((username) => {
			return <option key={username} value={username}>{username}</option>;
		});
	}

	var renderedGroups;
	renderedGroups = groups.map(group => {
		return (
			<div key={group.roomid}>
				<Button variant='btn btn-outline-light' data-active={group.roomid === roomId.current} onClick={() => {changeGroup(group.roomid);}} className="group"  style={{"color": stringToColour(group.name)}}>{group.name}</Button>
			</div>
		);
	});

	var previousMessageSender;
	var previousMessageTime;

	var renderedMessages = messages.map(message => {
		const date = new Date(message.time);
		
		if (previousMessageSender === message.sender && message.time - previousMessageTime < 20000) {
			previousMessageSender = message.sender;
			previousMessageTime = message.time;
			return <p key={message.time.toString()} style={{"background": stringToColour(message.sender)}} className='message'><Linkify>{message.message}</Linkify>{processAttachmentLinks(message.message)}</p>
		} else {
			previousMessageSender = message.sender;
			previousMessageTime = message.time;
			return <p key={message.time.toString()}  style={{"background": stringToColour(message.sender)}} className='message'><b>{message.sender} - {date.toLocaleString([], {hour: 'numeric', minute: '2-digit', hour12: true, day: 'numeric', year: 'numeric', month: 'short'})} { adminsInGroup ? (adminsInGroup.includes(message.sender) ? "(admin)" : null) : null}</b><br/><br/><Linkify>{message.message}</Linkify>{processAttachmentLinks(message.message)}</p>;
		}
		
	});
	
	return (
		<div id="chat-body">
			<dialog ref={emojiDialog}>
				<EmojiPicker onEmojiClick={appendEmoji}/>

				<form method="dialog">
					<div className="button-group">
						<button>Done</button>
					</div>
				</form>
			</dialog>
			
			<dialog ref={optionsGroupDialogAddAdmin}>
				<form method="dialog">
					<input id="adduserinput" ref={addAdminInput}></input>
					<label htmlFor="adduserinput">Username</label>

					<div className="button-group">
						<button onClick={() => {
							chatapi.addAdminToGroup(addAdminInput.current.value, roomId.current);
							
							socket.emit('usersmutated', {"roomid": roomId.current});
						}}>Add Admin</button>
						<button>Cancel</button>
					</div>
				</form>
			</dialog>

			<dialog ref={optionsGroupDialogRemoveAdmin}>
				<form method="dialog">
					<select ref={removeAdminSelect}>
						{renderedRemoveAdminOptions}
					</select>

					<div className="button-group">
						<button type="submit" value="submit" onClick={() => {
							const removeduser = removeAdminSelect.current.value;
							chatapi.removeAdminFromGroup(removeduser, roomId.current)
	
							socket.emit('usersmutated', {"roomid": roomId.current});
						}}>Remove Admin</button>
						<button type="submit" value="cancel">Cancel</button>
					</div>
				</form>
			</dialog>
			
			<dialog ref={optionsGroupDialogAddUser}>
				<form method="dialog">
					<input id="adduserinput" ref={addUserInput}></input>
					<label htmlFor="adduserinput">Username</label>

					<div className="button-group">
						<button onClick={() => {
							chatapi.addPersonToGroup(addUserInput.current.value, roomId.current);
							
							socket.emit('usersmutated', {"roomid": roomId.current});
						}}>Add User</button>
						<button>Cancel</button>
					</div>
				</form>
			</dialog>

			<dialog ref={optionsGroupDialogRemoveUser}>
				<form method="dialog">
					<select ref={removeUserSelect}>
						{renderedRemoveOptions}
					</select>

					<div className="button-group">
						<button type="submit" value="submit" onClick={() => {
							const removeduser = removeUserSelect.current.value;
							chatapi.removePersonFromGroup(removeduser, roomId.current)
	
							socket.emit('usersmutated', {"roomid": roomId.current});
						}}>Remove User</button>
						<button type="submit" value="cancel">Cancel</button>
					</div>
				</form>
			</dialog>
			
			<dialog ref={optionsGroupDialogDeleteGroup}>
				<form method="dialog">
					<p>Are you sure you want to delete this group? This action can't be reversed.</p>
					
					<button type="submit" value="submit" onClick={() => deleteGroup(roomId.current)}>Delete</button>
					<button type="submit" value="cancel">Cancel</button>
				</form>
			</dialog>

			<dialog ref={optionsGroupDialogLeaveGroup}>
				<form method="dialog">
					<p>Are you sure you want to leave this group? This action can't be reversed.</p>

					<div className="button-group">
						<button type="submit" value="submit" onClick={() => leaveGroup(roomId.current)}>Leave</button>
						<button type="submit" value="cancel">Cancel</button>
					</div>
				</form>
			</dialog>
			
			<dialog ref={optionsGroupDialog}>
				{ currentGroup ? (<>
						<ul>
							{currentGroup.users.map((user) => {
								return <li key={user} style={{"color": stringToColour(user)}}>{user} {currentGroup.admins.includes(user) ? "(admin)" : null}</li>
							})}
						</ul>
						<br/>										
				</>) : null}
				<form method="dialog">
					{ isUserAdmin && (<>
						
						<div className="button-group">
							<button onClick={() => {optionsGroupDialogAddAdmin.current.showModal();}}>Add Admin</button>
							<button onClick={() => {optionsGroupDialogRemoveAdmin.current.showModal();}}>Remove Admin</button>
						</div>
						
						<div className="button-group">
							<button onClick={() => {optionsGroupDialogAddUser.current.showModal();}}>Add User</button>
							<button onClick={() => {optionsGroupDialogRemoveUser.current.showModal();}}>Remove User</button>
						</div>
						
						<div className="button-group" style={{"background": "rgba(255, 0, 0, 0.5)"}}>
							<button onClick={() => {optionsGroupDialogDeleteGroup.current.showModal();}} style={{"background": "rgba(255, 0, 0, 0.5)"}}>Delete Group</button>
						</div>
					</>)}

					<div className="button-group">
						<button onClick={() => {optionsGroupDialogLeaveGroup.current.showModal();}}>Leave Group</button>
						<button type="submit" value="cancel">Close</button>
					</div>
				</form>
			</dialog>
			
			<dialog id="creategroupdialog" ref={createGroupDialog}>
				<form method="dialog">
					<input id="creategroupname" ref={createGroupDialogName}></input>
					<label htmlFor="creategroupname">Name</label>

					<div className="button-group">
						<button type="submit" value="confirm" onClick={async () => {
							const newgroupid = await chatapi.createGroup(createGroupDialogName.current.value);
							if (newgroupid) {
								await getGroups();
								await changeGroup(newgroupid);
							}
						}}>Create</button>
						<button type="submit" value="cancel">Cancel</button>
					</div>
				</form>
			</dialog>
		
			<div id='chat'>
				<div id='groupwindow'>
					<Button variant='btn btn-outline-light' id="creategroup" onClick={() => {
						createGroupDialogName.current.value = "";
						createGroupDialog.current.showModal();
					}}>Create Group</Button>
					
					{renderedGroups}

					{roomId.current != "" && <Button variant='btn btn-outline-light' id="options" onClick={groupOptions}>Options</Button>}
				</div>
				{roomId.current != "" ? <div id='chatwindow'>
	
					<div id='interface'>
						<input type='text' ref={chatInput}></input>
						
						<button onClick={showEmojiPicker}>Emoji</button>
            <button ref={sendButton}>Send</button>
					</div>
					
					<div id='messages' ref={messagesDiv}>
						<Button variant='btn btn-outline-light' id="loadmessages" onClick={loadNewPage} ref={loadMessagesButton}>Load More Messages</Button>
						{renderedMessages}
					</div>
					
				</div> : <ChatWelcome/>}
			</div>
		</div>
	);
}

export default Chat;
