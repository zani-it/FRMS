import { useEffect, useState } from "react";
import "./PractionerWaitlist.scss";

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

function PractionerWaitList(props) {
  const [waitlist, setWaitlist] = useState(null);
  const [lastAttended, setLastAttended] = useState(null);

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
      localStorage.setItem("practionerWaitlist", JSON.stringify(prevWaitlist));
    }
  };

  useEffect(() => {
    const storedWaitlist = localStorage.getItem("practionerWaitlist");
    if (storedWaitlist) {
      setWaitlist(JSON.parse(storedWaitlist));
    } else {
      setWaitlist([]);
    }
  }, []);

  useEffect(() => {
    if (waitlist !== null) {
      localStorage.setItem("practionerWaitlist", JSON.stringify(waitlist));
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
  })

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
        <div>
          
          <div className="practioner-waitlist__table">
            {waitlist !== null && (
              <table>
                <div className="practioner-table__box">
                <thead>
                  <tr className="practioner-table__header">
                    <th className="practioner-table__cell">Last Name</th>
                    <th className="practioner-table__cell">First Name</th>
                    <th className="practioner-table__cell">Time Waiting</th>
                    <th className="practioner-table__cell">Patient Details</th>
                    <th className="practioner-table__cell">Attended</th>
                   
                  </tr>
                </thead>
            
                <tbody>
                  {waitlist
                    .slice()
                    .reverse()
                    .map((person, index) => (
                      <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"} title={person.details}>
                        <td className="practioner-table__cell">
                          {person.lastName}
                        </td>
                        <td className="practioner-table__cell" >
                          {person.firstName}
                        </td>
                        <td className="practioner-table__cell">
                          {person.timeWaiting}
                        </td>
                        <td className="practioner-table__cell">
                          {" "}
                          <button
                            className="practioner-waitlist__button"
                            onClick={() => {
                              localStorage.setItem(
                                "person",
                                JSON.stringify(person)
                              );
                              window.open("/patient-details", "_blank");
                            }}
                          >
                            Patient Details
                          </button>
                        </td>
                        <td className="practioner-table__cell">
                          <button
                            className="practioner-waitlist__button"
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
      </div>
      <div>
        {lastAttended && (
          <div>
            <h2>Last Attended</h2>
            <p>{`${lastAttended.lastName}, ${lastAttended.firstName}, ${
              lastAttended.attendedTime ? lastAttended.timeWaited : "-"
            }`}</p>
          </div>
        )}
      </div>
      <div>
        <div className="practioner-button__box">
          <button
            className="practioner-waitlist__button"
            onClick={() => {
              window.open("/form", "_blank");
            }}
          >
            Add New
          </button>
        </div>
      </div>
    </div>
  );
}

export default PractionerWaitList;
