import "./App.scss";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PatientDetails from "./pages/PatientDetails/PatientDetails";
import WaitList from "./pages/WaitList/WaitList";
import Form from "./pages/Form/Form";
import Monitor from "./pages/Monitor/Monitor";
import HomeMenu from "./pages/HomeMenu/HomeMenu";
import Header from "./pages/Header/Header";
import PracticianMenu from "./pages/CustomMenus/PracticianMenu/PracticianMenu";
import ReturnButton from "./pages/Components/ReturnButton";



const WS_URL = "ws://localhost:3333";

function App() {
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

  function getTitleForRoute(route, location) {
    switch (route) {
      case "/":
        return "Home Menu";
      case "/patient-details":
        return "Patient Details Form";
      case "/waitlist":
        return "Wait List";
      case "/form":
        return "New Patient Form";
      case "/monitor":
        return "Face Detection Monitor";
      case "practicianmenu":
        return "Practician Menu";
      default:
        return "";
    }
  }

  useEffect(() => {
    // Update the document title based on the current route
    const title = getTitleForRoute(location.pathname, location);
    document.title = `FRMS - ${title}`;
  }, [location]);

  return (
    <Router>
      <div className="App__content">
        <Header />
        <ReturnButton />
        <header className="App__header">
          <Routes>
            <Route path="*" element={<HomeMenu />} />
            <Route path="/patient-details" element={<PatientDetails />} />
            <Route path="/waitlist" element={<WaitList person={person} />} />
            <Route path="/form" element={<Form />} />
            <Route path="/monitor" element={<Monitor />} />
            <Route path="/practicianmenu" element={<PracticianMenu />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
