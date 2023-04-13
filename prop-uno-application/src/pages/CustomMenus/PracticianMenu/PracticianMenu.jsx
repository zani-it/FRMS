import "./PracticianMenu.scss";
import { useState, useEffect } from "react";
import PracticionerWaitlist from "./Components/PractionerWaitlist";
import PageSelector from "./Components/PageSelector";

let DoctorName = "House";

const WS_URL = "ws://localhost:3333";

function PracticianMenu() {
  const [socket, setSocket] = useState(null);
  const [person, setPerson] = useState(null);

  function handleSocketOpen() {
    console.log("connected on ws");
  }

  function handleSocketMessage(event) {
    const person = JSON.parse(event.data);
    setPerson(person);
    console.log(person);
  }

  function connectToWebSocket() {
    const ws = new WebSocket(WS_URL);
    ws.onopen = handleSocketOpen;
    ws.onmessage = handleSocketMessage;
    setSocket(ws);
  }

  useEffect(() => {
    connectToWebSocket();
  }, []);


  return (
    <div className="practicioner__content">
      <header className="practioner__header">
        
          <div className="practioner__title-box">
            <h1>Hello Dr.{DoctorName}, here is your patient waitlist</h1>
          </div>
          </header>
          <section>
        <div>
        <div>
            <PracticionerWaitlist  person={person} />
          </div>
        {/* <div>
          <PageSelector />
        </div> */}
        </div>
        </section>
    
    </div>
  );
}

export default PracticianMenu;
