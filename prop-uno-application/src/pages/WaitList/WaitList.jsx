import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./WaitList.scss";

function formatTimeWaiting(milliseconds) {
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
  const [waitlist, setWaitlist] = useState([]);
  const [lastAttended, setLastAttended] = useState(null);

  const addPersonToWaitlist = (person) => {
    setWaitlist((prevWaitlist) => {
      const lastName = person.lastName;
      const firstName = person.firstName;
      if (
        prevWaitlist.some(
          (p) => p.lastName === lastName && p.firstName === firstName
        )
      ) {
        console.log(`${lastName}, ${firstName} already in waitlist`);
        return prevWaitlist;
      } else {
        const now = new Date();
        const addedTime = now.getTime();
        const newPerson = {
          ...person,
          addedTime,
          timeWaiting: formatTimeWaiting(now - addedTime),
        };
        console.log(`Adding ${lastName}, ${firstName} to waitlist`);
        return [...prevWaitlist, newPerson];
      }
    });
  };

  useEffect(() => {
    if (props.person) {
      addPersonToWaitlist(props.person);
    }
  }, [props.person]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaitlist((prevWaitlist) =>
        prevWaitlist.map((person) => {
          const now = new Date();
          return {
            ...person,
            timeWaiting: formatTimeWaiting(now - person.addedTime),
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div>
        <h1>Waitlist</h1>
        <table>
          <thead>
            <tr className="header__table">
              <th>Last Name</th>
              <th>First Name</th>
              <th>Time Waiting</th>
              <th>Attended</th>
              <th>Patient Details</th>
            </tr>
          </thead>
          <tbody>
            {waitlist.map((person, index) => (
              <tr key={index}>
                <td>{person.lastName}</td>
                <td>{person.firstName}</td>
                <td>{person.timeWaiting}</td>
                <td>
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
                <td>
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
