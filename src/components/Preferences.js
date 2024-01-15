import './Welcome.css';
import React from "react";
import { api } from "./api.js";
import { useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap';

function Preferences() {
		const navigate = useNavigate();

		function deleteUser() {
			api.deleteUser();
			navigate("/log");
		}

    return (
			<>
	      <div className="mainDiv">
	       	<div className="row">
	          <h1>Preferences</h1>
	          <Button variant="danger" onClick={deleteUser}>Delete This Account</Button>
	      	</div>
	    	</div>
			</>
  	);
}

export default Preferences;