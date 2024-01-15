import './BobuxClicker.css';
import React, { useEffect, useState, useRef } from 'react';
import Techtree from "./Techtree";
import { api } from "../api.js";
import { suffixes } from "../suffixes.js";

function BobuxClicker() {

  const canvas = useRef(0);
  const dialog = useRef(0);
  const partimg = useRef(0);

  const shopbuybutton1 = useRef(0);
  const shopbuybutton2 = useRef(0);
  const shopbuybutton3 = useRef(0);
  const shopbuybutton4 = useRef(0);
  const shopbuybutton5 = useRef(0);

  const [points, setpoints] = useState(0);
  const [increment, setincrement] = useState(1);
  const [autoclickinc, setautoclickinc] = useState(0);
  const [level, setlevel] = useState(1);
  const [exprequired, setexprequired] = useState(10);
  const [experience, setexperience] = useState(0);
  const [expmultiplier, setexpmultiplier] = useState(1);
  const [autoclicktime, setautoclicktime] = useState(2000);

  const [shopbuyamount, setshopbuyamount] = useState(1);

  const autoclicker = useRef(0);
  const animId = useRef(0);

  const particles = useRef([]);

  const [particlesEnabled, setParticlesEnabled] = useState(true);

  const autoClickerFunction = () => {
    setpoints((p) => { return p + (autoclickinc) });
    setexperience((exp) => { return exp + (expmultiplier * autoclickinc); });

    if (experience >= exprequired) {
      levelUp();
    }
  };

  const toggleParticles = () => {
    if (particlesEnabled) {
      setParticlesEnabled(false);
    } else {
      particles.current = [];
      setParticlesEnabled(true);
      loop();
    }
  };

  const loop = () => {

    const ctx = canvas.current.getContext("2d");

    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);

    var i;

    for (i = 0; i < particles.current.length; i++) {
      ctx.drawImage(partimg.current, particles.current[i][0], particles.current[i][1], 40, 20);

      particles.current[i][3] += 1;

      particles.current[i][0] += particles.current[i][2];
      particles.current[i][1] += particles.current[i][3];

      if (particles.current[i][0] > canvas.current.width || particles.current[i][0] < -40) {
        particles.current[i] = null;
      }

      if (particles.current[i]) {
        if (particles.current[i][1] > canvas.current.height) {
          particles.current[i] = null;
        }
      }

    }

    particles.current = particles.current.filter(Boolean);

    if (!particlesEnabled) {
      ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
      return;
    }

    animId.current = requestAnimationFrame(loop);
  }

  const sizeCanvas = () => {
    if (!canvas) return;
    canvas.current.width = window.innerWidth;
    canvas.current.height = window.innerHeight;
  };

  const buttonClicked = () => {
    setpoints(points + increment);
    setexperience(experience + expmultiplier);

    if (experience >= exprequired) {
      levelUp();
    }
  };

  const createParticle = (x, y, xspeed, yspeed) => {
    particles.current.push([x, y, xspeed, yspeed]);
  };

  const createRain = () => {
    const limit = Math.min(increment, 100);

    for (var i = 0; i < limit; i++) {
      createParticle(canvas.current.width * Math.random(), -20, 20 * (Math.random() - 0.5), 10 * (Math.random() - 0.5));
    }
  };

  const upgradeButton = () => {
    if (shopCost(Math.round(10 * increment) * shopbuyamount)) {
      setincrement((increment + (shopbuyamount * (getUnitValue(humanFormat(increment)) * 0.5))));
    }
  };

  const upgradeExpmult = () => {
    if (shopCost(Math.round(11.5 * expmultiplier) * shopbuyamount)) {
      setexpmultiplier((expmultiplier + (0.5 * shopbuyamount * (getUnitValue(humanFormat(expmultiplier)) * 1))));
    }
  };

  const upgradeAutoclicker = () => {
    if (shopCost(Math.round(104.8 * (autoclickinc + 1)) * shopbuyamount)) {
      setautoclickinc((autoclickinc + (shopbuyamount * getUnitValue(humanFormat(autoclickinc)) * 1)));
    }
  };

  const upgradeAutoclickertime = () => {
    if (shopCost(Math.round(504.8 * (2000 / autoclicktime)) * shopbuyamount)) {
      setautoclicktime(autoclicktime * 0.8 * shopbuyamount);
    }
  };

  const openOptions = () => {
    dialog.current.showModal();
  };

  const createExplosion = (x, y, power, parts) => {
    for (var i = 0; i < parts; i++) {
      createParticle(x, y, (Math.random() - 0.5) * power, (Math.random() - 0.5) * power);
    }
  };

  const shopCost = (cost) => {
    if (points >= cost) {
      setpoints(points - cost);
      createExplosion(canvas.current.width / 2, canvas.current.height / 2, 100, 100);
      return true;
    }
    return false;
  };

  const levelUp = () => {
    setexperience(0);

    // Shallow state workaround.
    var updatedLevel;
    setlevel((l) => { const newvalue = l + 1; updatedLevel = newvalue; return newvalue });

    if (updatedLevel % 3 === 0) {
      setincrement((i) => { return i + 1 });
    }

    setexprequired((expreq) => { return Math.round(expreq * 1.56) });

    createExplosion(0, canvas.current.height / 2, 50, 50);
    createExplosion(canvas.current.width / 2, canvas.current.height / 2, 100, 50);
    createExplosion(canvas.current.width, canvas.current.height / 2, 50, 50);

    saveGame();
  };

  const saveGame = (silence) => {
    api.saveBobuxClicker(humanFormat(points), humanFormat(increment), humanFormat(autoclickinc), humanFormat(level), humanFormat(experience), humanFormat(exprequired), humanFormat(expmultiplier), autoclicktime, silence);
  };

  const loadGame = async () => {
    try {
      const response = await api.getBobuxClicker();

      setpoints(parseHumanFormat(response.data["Points"]));
      setincrement(parseHumanFormat(response.data["Increment"]));
      setautoclickinc(parseHumanFormat(response.data["Autoclicker Increment"]));
      setlevel(parseHumanFormat(response.data["Level"]));
      setexperience(parseHumanFormat(response.data["Experience"]));
      setexprequired(parseHumanFormat(response.data["Experience Required"]));
      setexpmultiplier(parseHumanFormat(response.data["Experience Multiplier"]));

      if (response.data["Autoclicker Speed"]) {
        setautoclicktime(response.data["Autoclicker Speed"]);
      } else {
        setautoclicktime(2000);
      }

    } catch (error) {
      if (!error.response) {
        alert("Couldn't reach the server.");
      }
    }
  };

  const deleteSave = () => {
    api.saveBobuxClicker("0", "1", "0", "1", "0", "10", "1", 2000);
  };

  const resetGame = () => {
    clearInterval(autoclicker.current);
    deleteSave();
  };

  // Start game when rendered

  useEffect(() => {
    async function getDatabaseData() {
      await loadGame();
      sizeCanvas();
    }
    getDatabaseData();

    // This function runs when BobuxClicker is unmounted.
    return function() {
      particles.current = [];
      clearInterval(autoclicker.current);
      cancelAnimationFrame(animId.current);
      window.removeEventListener("resize", sizeCanvas);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!canvas.current) return;

    window.removeEventListener("resize", sizeCanvas);
    window.addEventListener("resize", sizeCanvas);

    cancelAnimationFrame(animId.current);
    loop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, particlesEnabled]);

  useEffect(() => {
    clearInterval(autoclicker.current);
    autoclicker.current = setInterval(autoClickerFunction, autoclicktime);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exprequired, expmultiplier, autoclickinc, experience, increment, autoclicktime]);

  function humanFormat(num) {

    num = parseFloat(num.toExponential(3));
    let magnitude = 0;
    while (Math.abs(Math.ceil(num)) >= 1000) {
      magnitude += 1;
      num /= 1000.0;

      // If we run out of suffixes, use the last one.
      if (magnitude > (suffixes.length - 2)) {
        break;
      }
    }

    return num.toFixed(2).replace(/\.?0+$/, '') + suffixes[magnitude];
  }

  const getUnitValue = (abbreviatedNumber) => {

    const suffixPart = abbreviatedNumber.replace(/[\d.]/g, '');

    const magnitude = suffixes.indexOf(suffixPart);

    if (magnitude === -1 || suffixPart === "") {
      return 1;
    } else {
      return Math.pow(1000, magnitude);
    }
  }

  const parseHumanFormat = (abbreviatedNumber) => {

    const numPart = parseFloat(abbreviatedNumber);
    const suffixPart = abbreviatedNumber.replace(/[\d.]/g, '');

    const magnitude = suffixes.indexOf(suffixPart);

    if (magnitude === -1 || suffixPart === "") {
      return numPart;
    } else {
      return numPart * Math.pow(1000, magnitude);
    }
  }

  const setShopBuyAmount = (amount, element) => {
    if (element) {
      shopbuybutton1.current.dataset.active = false;
      shopbuybutton2.current.dataset.active = false;
      shopbuybutton3.current.dataset.active = false;
      shopbuybutton4.current.dataset.active = false;
      shopbuybutton5.current.dataset.active = false;
      element.dataset.active = true;
    }

    setshopbuyamount(amount);
  }

  return (
    <div id="bobux-body">
      <canvas id="bobux-funcanvas" ref={canvas}></canvas>

      <dialog id="bobux-options" ref={dialog}>

        <form method="dialog">

          <div>

            <button className="bobux-button bobux-irregular" type="submit">Close</button>
            <button className="bobux-button bobux-irregular" onClick={(e) => { saveGame(true); }}>Save Game</button>
            <button className="bobux-button bobux-irregular" onClick={toggleParticles}>Toggle Particles</button>
            <button className="bobux-button bobux-irregular" onClick={resetGame}>Full Reset</button>

          </div>

        </form>

      </dialog>

      <section className="bobux-section" id="bobux-main">
        <p id="bobux-title">Bobux Clicker</p>
        <img id="bobux-bobuximg" src="Bobux.png" alt="Bobux" ref={partimg} /><br></br><br></br>
        <button id="bobux-bigbutton" className="bobux-button" onClick={() => { buttonClicked(); createRain(); }}>Click</button>
      </section>

      <section className="bobux-section" id="bobux-stats">

        <h2 className="bobux-h2">Stats</h2>

        <p id="point">{"Bobux: " + humanFormat(points)}</p>
        <p id="inc">{"Bobux per Click: " + humanFormat(increment)}</p>
        <p id="level">{"Levels: " + humanFormat(level)}</p>
        <label htmlFor="exp">Experience: </label>
        <progress id="exp" className="bobux-progress" value={experience / exprequired} max="1"></progress>
        <p id="expmult">{"Experience Multiplier: x" + humanFormat(expmultiplier)}</p>
        <p id="auto">{"Auto Clicker Level: " + humanFormat(autoclickinc)}</p>
        <p id="autospeed">Auto Clicker Speed: {autoclicktime / 1000} secs</p>

      </section>

      <section className="bobux-section" id="bobux-shop">

        <h2 className="bobux-h2">Shop</h2>

        <div>
          <button className="bobux-button" data-active="true" ref={shopbuybutton1} onClick={(e) => { setShopBuyAmount(1, e.target) }}>1</button>
          <button className="bobux-button" data-active="false" ref={shopbuybutton2} onClick={(e) => { setShopBuyAmount(10, e.target) }}>10</button>
          <button className="bobux-button" data-active="false" ref={shopbuybutton3} onClick={(e) => { setShopBuyAmount(100, e.target) }}>100</button>
          <button className="bobux-button" data-active="false" ref={shopbuybutton4} onClick={(e) => { setShopBuyAmount(1000, e.target) }}>1K</button>
          <button className="bobux-button" data-active="false" ref={shopbuybutton5} onClick={(e) => { setShopBuyAmount(100000, e.target) }}>100K</button>
        </div>

        <button id="upgclick" className="bobux-button" data-buyable={points > Math.round(10 * increment) * shopbuyamount} onClick={upgradeButton}>{"Upgrade Button: " + humanFormat(Math.round(10 * increment) * shopbuyamount) + " Bobux"}</button><br></br>
        <button id="upgexpmult" className="bobux-button" data-buyable={points > Math.round(11.5 * expmultiplier) * shopbuyamount} onClick={upgradeExpmult}>{"Increase Experience Multiplier: " + humanFormat(Math.round(11.5 * expmultiplier) * shopbuyamount) + " Bobux"}</button><br></br>
        <button id="upgauto" className="bobux-button" data-buyable={points > Math.round(104.8 * (autoclickinc + 1) * shopbuyamount)} onClick={upgradeAutoclicker}>{"Upgrade Auto Clicker: " + humanFormat(Math.round(104.8 * (autoclickinc + 1)) * shopbuyamount) + " Bobux"}</button><br></br>
        <button id="upgautotime" className="bobux-button" data-buyable={points > Math.round(504.8 * (2000 / autoclicktime) * shopbuyamount)} onClick={upgradeAutoclickertime}>{"Upgrade Auto Clicker Speed: " + humanFormat(Math.round(504.8 * (2000 / autoclicktime)) * shopbuyamount) + " Bobux"}</button><br></br>

      </section>

      <footer id="bobux-footer">

        <button className="bobux-button" onClick={openOptions}>Options</button><br></br>

        <span>This game is dedicated to Bob. Made in a HS Physics Course </span>

      </footer>
    </div>
  )
}

export default BobuxClicker;
