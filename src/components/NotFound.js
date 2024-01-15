import './Welcome.css';
import React from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from 'react';

function NotFound() {

    const particlesInit = useCallback(async engine => {
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async container => {
        document.getElementById("tsparticles").style.opacity = 20;
    }, []);

    return (
        
        <div>
          <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            url="./particles.json"
        />
      <div className="mainDiv">
        <div className="row">
          <h1>404 Not Found</h1>
          <p className='para'>{"Page not found!"}</p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;