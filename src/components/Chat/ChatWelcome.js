
import './ChatWelcome.css';

function ChatWelcome() {
	return (
		<div id="chatwindow" className="chatwindow-welcome">
			<h2 id="chatwelcometitle">Welcome, {sessionStorage.getItem('username')}!</h2>
			<p id="chatwelcomepara">Join a group and start chatting!</p>
			<div id="chatwelcomebenefits">
				<h3>Chat's Benefits:</h3>
				<p>
					Updates messages in real-time.<br/>
					Cool User Interface.<br/>
					Ease of use.
				</p>
			</div>
		</div>
	);
}

export default ChatWelcome;
