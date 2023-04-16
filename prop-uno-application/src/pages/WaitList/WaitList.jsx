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
  const roomMap = {
    "Cardiology": "01",
    "Gastroenterology": "02",
    "Neurology": "03",
    "Orthopedics": "04",
    "Pulmonology": "05",
     };
  
  const addPersonToWaitlist = (person) => {
    const addedTime = new Date().getTime();
    const timeWaiting = 0;

    setWaitlist((prevWaitlist) => {
      let personAdded = false;

      // Check if person is already in waitlist
      const updatedWaitlist = prevWaitlist.map((p) => {
        if (p.lastName === person.lastName) {
          personAdded = true;
          const updatedPerson = {
            ...p,
            addedTime: addedTime,
            timeWaiting: timeWaiting,
          };
          return updatedPerson;
        } else {
          return p;
        }
      });

      if (!personAdded) {
        // Person is not in waitlist, add them to the end
        const updatedPerson = {
          ...person,
          addedTime: addedTime,
          timeWaiting: timeWaiting,
        };
        updatedWaitlist.push(updatedPerson);
      }

      return updatedWaitlist;
    });
  };

  const handleWebSocketMessage = (message, prevWaitlist) => {
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
      localStorage.setItem("waitlist", JSON.stringify(prevWaitlist));
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
      window.location.reload();
    }, 30000);
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setWaitlist((prevWaitlist) =>
        prevWaitlist.map((person) => {
          const addedTime = person.addedTime;
          const timeWaiting = now.getTime() - addedTime;
          return {
            ...person,
            timeWaiting: formatTimeWaiting(now - person.addedTime),
          };
        })
      );
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (props.websocket) {
      props.websocket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message, waitlist);
      });
    }
  }, [props.websocket, waitlist]);

  return (
    <div>
      <div>
        <div className="waitlist__table">
          <h1>Patient Waitlist</h1>
          {waitlist !== null && (
            <table>
              <div className="waitlist-table__box">
                <thead>
                  <tr className="table__header">
                    <th className="table__cell">Last Name</th>
                    <th className="table__cell">First Name</th>
                    <th className="table__cell">Time Waiting</th>
                    <th className="table__cell">Medical Specialty</th>
                    <th className="table__cell">Room</th>
                    <th className="table__cell">Attended</th>
                  </tr>
                </thead>

                <tbody>
                  {waitlist
                    .slice()
                    .reverse()
                    .map((person, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "even-row" : "odd-row"}
                        title={person.details}
                      >
                        <td className="table__cell">{person.lastName}</td>
                        <td className="table__cell">{person.firstName}</td>
                        <td className="table__cell">{person.timeWaiting}</td>

                        <td className="table__cell">
                          {person.medicalSpecialty}
                        </td>
                        <td className="table__cell">{roomMap[person.medicalSpecialty]}</td>
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
                      </tr>
                    ))}
                </tbody>
              </div>
            </table>
          )}
        </div>
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
