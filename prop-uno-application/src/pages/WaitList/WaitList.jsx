import { useEffect, useState } from "react";
import "./WaitList.scss";

function formatTimeWaiting(milliseconds) {
  if (milliseconds === 0) {
    return "0 seconds";
  }

  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hour${hours === 1 ? "" : "s"} ${remainingMinutes} minute${
      remainingMinutes === 1 ? "" : "s"
    }`;
  } else if (minutes >= 1) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ${seconds} second${
      seconds === 1 ? "" : "s"
    }`;
  } else {
    return `${seconds} second${seconds === 1 ? "" : "s"}`;
  }
}


function WaitList(props) {
  const [waitlist, setWaitlist] = useState(null);
  const [lastAttended, setLastAttended] = useState(null);

  const addPersonToWaitlist = (person) => {
    const addedTime = new Date().getTime();
    const timeWaiting = 0;
    const updatedPerson = {
      ...person,
      addedTime: addedTime, // Assign the `addedTime` variable to the `addedTime` property of the `updatedPerson` object.
      timeWaiting: timeWaiting, // Assign the `timeWaiting` variable to the `timeWaiting` property of the `updatedPerson` object.
    };
    
    // Check if person already exists in waitlist
    if (!waitlist.some((p) => p.id === person.id)) {
      setWaitlist((prevWaitlist) => [...prevWaitlist, updatedPerson]);
    }
  };
  

  const handleWebSocketMessage = (message) => {
    const { type, payload } = message;
    if (type === "PERSON_UPDATED") {
      const updatedPerson = payload;
      setWaitlist((prevWaitlist) =>
        prevWaitlist.map((person) =>
          person.id === updatedPerson.id
            ? { ...updatedPerson, timeWaiting: person.timeWaiting }
            : person
        )
      );
    }
  };

  useEffect(() => {
    const storedWaitlist = localStorage.getItem("waitlist");
    if (storedWaitlist) {
      setWaitlist(JSON.parse(storedWaitlist));
    } else {
      setWaitlist([]);
    }
  }, []);

  useEffect(() => {
    if (waitlist !== null) {
      localStorage.setItem("waitlist", JSON.stringify(waitlist));
    }
  }, [waitlist]);

  useEffect(() => {
    if (props.person) {
      addPersonToWaitlist(props.person);
    }
  }, [props.person]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setWaitlist((prevWaitlist) =>
        prevWaitlist.map((person) => {
          const addedTime = person.addedTime;
          const timeWaiting = now.getTime() - addedTime;
          return { ...person, timeWaiting: formatTimeWaiting(now - person.addedTime) };
        })
      );
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
  

  useEffect(() => {
    if (props.websocket) {
      props.websocket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
      });
    }
  }, [props.websocket]);


  return (
    <div>
      <div>
        <h1>Waitlist</h1>
        {waitlist !== null && (
          <table>
            <thead>
              <tr className="table__header">
                <th className="table__cell">Last Name</th>
                <th className="table__cell">First Name</th>
                <th className="table__cell">Time Waiting</th>
                <th className="table__cell">Attended</th>
                <th className="table__cell">Patient Details</th>
              </tr>
            </thead>
            <tbody>
              {waitlist.map((person, index) => (
                <tr key={index}>
                  <td className="table__cell">{person.lastName}</td>
                  <td className="table__cell">{person.firstName}</td>
                  <td className="table__cell">{person.timeWaiting}</td>
                  <td className="table__cell">
                    <button
                    className="waitlist__button"
                    onClick={() => {
                      const now = new Date();
                      const timeWaiting = formatTimeWaiting(
                        now - person.addedTime
                      );
                        setWaitlist((prevWaitlist) =>
                          prevWaitlist.filter((p) => p !== person)
                        );
                        const attendedTime = now.getTime();
                        setLastAttended({
                          ...person,
                          attendedTime,
                          timeWaiting: formatTimeWaiting(
                            attendedTime - person.addedTime
                          ),
                          timeWaited: formatTimeWaiting(
                            attendedTime -
                              person.addedTime -
                              (person.pausedTime || 0)
                          ),
                        });
                      }}
                    >
                      Attended
                    </button>
                  </td>
                  <td className="table__cell">
                    {" "}
                    <button
                      className="waitlist__button"
                      onClick={() => {
                        localStorage.setItem("person", JSON.stringify(person));
                        window.open("/patient-details", "_blank");
                      }}
                    >
                      Patient Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {lastAttended && (
        <div>
          <h2>Last Attended</h2>
          <p>{`${lastAttended.lastName}, ${lastAttended.firstName}, ${
            lastAttended.attendedTime ? lastAttended.timeWaited : "-"
          }`}</p>
        </div>
      )}
    </div>
  );
  
}

export default WaitList;
