import React, { useState, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Form.scss";

function Form() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sexAtBirth, setSexAtBirth] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(Date.now());
  const [age, setAge] = useState(calculateAge(new Date()));
  const [medicalCondition, setMedicalCondition] = useState("Follow-up");
  const [medicalSpecialty, setMedicalSpecialty] = useState("");
  const [details, setDetails] = useState("");
  const [imageData, setImageData] = useState(null);
  const [imageExistingData, setImageExistingData] = useState(null);
  const [imageFrozen, setImageFrozen] = useState(false);
  const [email, setEmail] = useState("");
  const videoRef = useRef(null);

  const birthdayString = "1990-01-01";
  const birthday = new Date(birthdayString);
  const now = new Date();
  const ageInMillis = now.getTime() - birthday.getTime();
  const ageInYears = ageInMillis / (1000 * 60 * 60 * 24 * 365);
  console.log(ageInYears);

  const medicalSpecialtyOptions = [
    "Cardiology",
    "Gastroenterology",
    "Neurology",
    "Orthopedics",
    "Pulmonology",
  ];

  function calculateAge(birthday) {
    const ageDiffMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDiffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  const handleEmailChange = (event) => {
    const input = event.target.value;
    setEmail(input);
  };

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleFirstNameChange = (event) => {
    const input = event.target.value;
    const capitalized = capitalize(input);
    setFirstName(capitalized);
  };

  const handleLastNameChange = (event) => {
    const input = event.target.value;
    const capitalized = capitalize(input);
    setLastName(capitalized);
  };

  const handleSexAtBirthChange = (event) => {
    const value = event.target.value;
    setSexAtBirth(value);
  };

  const handleDateOfBirth = (date) => {
    if (dateValidate(date)) {

      const dateObj = new Date(date);
      setDateOfBirth(dateObj);
      setAge(calculateAge(dateObj));
    } else {
      setDateOfBirth(new Date(null));
      setAge("");
    }
  };
  
  function dateValidate(strData) {
    // Tenta criar um objeto Date a partir da string
    var data = new Date(strData);
  
    // Verifica se o objeto Date é válido
    if (isNaN(data.getTime())) {
      // Se o objeto Date não for válido, a string não é uma data válida
      return false;
    }
  
    // Se o objeto Date for válido, a string é uma data válida
    return true;
  }
  

  const handleMedicalConditionChange = (event) => {
    setMedicalCondition(event.target.value);
  };

  const handleMedicalSpecialtyChange = (event) => {
    setMedicalSpecialty(event.target.value);
  };

  const handleDetailsChange = (event) => {
    setDetails(event.target.value);
  };

  const handleImageCapture = (event) => {
    event.preventDefault();
    const screenshot = videoRef.current.getScreenshot();
    setImageData(screenshot);
    // setImageFrozen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // create post data
    const postData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      sexAtBirth: sexAtBirth,
      dateOfBirth: dateOfBirth.toISOString(),
      age: age,
      medicalCondition: medicalCondition,
      medicalSpecialty: medicalSpecialty,
      details: details,
      image: imageData,
    };

    axios
      .post("http://localhost:3001/register", postData)
      .then((response) => {
        const result = response.data;
        console.log(result);
        alert("Form submitted successfully!");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleFind = async (event) => {
    event.preventDefault();

    const findData = {
      email: email,
    };

    axios
      .post("http://localhost:3001/find", findData)
      .then((response) => {
        const result = response.data[0]; // access the first element of the array
        console.log(result.age); // should log 35

        const dateOfBirthString = `${result.dateOfBirth}`;
        const dateOfBirth = new Date(dateOfBirthString);
        const formattedDateOfBirth = dateOfBirth.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        console.log(formattedDateOfBirth);

        // client found, update state
        setFirstName(result.firstName || "");
        setLastName(result.lastName || "");
        setDateOfBirth(new Date(formattedDateOfBirth) || "")
        setSexAtBirth(result.sexAtBirth || "");
        setAge(result.age || "");
        setMedicalCondition(result.medicalCondition || "");
        setMedicalSpecialty(result.medicalSpecialty || "");
        setDetails(result.details || "");
        setImageExistingData(result.image || null);
      })
      .catch((error) => {
        // client not found, reset state
        console.error(error);
        setFirstName("");
        setLastName("");
        setSexAtBirth("");
        setAge(calculateAge(new Date()));
        setMedicalCondition("");
        setMedicalSpecialty("");
        setDetails("");
        setImageData(null);
      });
  };

  const handleNewForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setSexAtBirth("male");
    setDateOfBirth(new Date());
    setAge(calculateAge(new Date()));
    setMedicalCondition("Follow-up");
    setMedicalSpecialty("");
    setDetails("");
    setImageData(null);
    setImageFrozen(false);
    setImageExistingData(null)
  };

  return (
    <form className="form__body">
      <h1 className="form__header"> Patient Form </h1>
      <label className="centralized">
        <h3>Email:</h3>
        <input  className=""type="email" value={email} onChange={handleEmailChange} />
      </label>
      <br />
      <label label className="centralized">
       <h3> Birthday:</h3>
        <DatePicker
          selected={dateOfBirth}
          onChange={(date) =>
            handleDateOfBirth(date)
          }
          maxDate={new Date()}
          showYearDropdown
       
          showMonthDropdown
          showDayDropdown
   
          dateFormat="yyyy-MM-dd"
        />
      </label>
      <br />
      <button className="button-capture" onClick={handleFind}>Find Existing Patient</button>
      <br />
      <label  className="centralized">
      <h3 >First Name:</h3>
        <input type="text" value={firstName} onChange={handleFirstNameChange} />
      </label>
      <br />
      <label  className="centralized">
      <h3>Last Name:</h3>
        <input type="text" value={lastName} onChange={handleLastNameChange} />
      </label>
      <br />

      <label className="centralized">
       <h3> Sex at Birth:</h3>
        <div className="input__sex">
          <label>
            <input
              type="radio"
              name="sexAtBirth"
              value="male"
              checked={sexAtBirth === "male"}
              onChange={handleSexAtBirthChange}
            />
            <span>Male</span>
          </label>
          <label>
            <input
              type="radio"
              name="sexAtBirth"
              value="female"
              checked={sexAtBirth === "female"}
              onChange={handleSexAtBirthChange}
            />
            <span>Female</span>
          </label>
        </div>
      </label>
      <br />

      <label className="centralized">
       <h3> Age:</h3>
        <input type="number" value={age} disabled />
      </label>
      <br />
      <label className="centralized">
       <h3> Medical Condition:</h3>
        <select
          value={medicalCondition}
          onChange={handleMedicalConditionChange}
        >
          <option value="">Select One</option>
          <option value="follow-up">Follow-up</option>
          <option value="walk-in">Walk-in</option>
          <option value="image-exam">Image Exam</option>
          <option value="stable">Stable</option>
          <option value="urgent">Urgent</option>
          <option value="critical">Critical</option>
        </select>
      </label>
      <br />
      < label className="centralized">
      <h3>Medical Specialty:</h3>
        <select
          value={medicalSpecialty}
          onChange={handleMedicalSpecialtyChange}
        >
          <option value="">Select One</option>
          {medicalSpecialtyOptions.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label className="form__details centralized">
      <h3>Details:</h3>
        <textarea className="form__details-textarea"value={details} onChange={handleDetailsChange} />
      </label>
      <br />
      <div className="form__webcam">
        <Webcam audio={false} ref={videoRef} width="320" height="240" />
        <button className="button-capture" onClick={handleImageCapture}>Capture Image</button>
      </div>
      <br />
      <div className="form__image">
        {imageData && (
          <img  className="form__image-item" src={imageData} alt="Captured Image" width="320" height="240" margin="0.5 0"/>
        )}
      </div>
      <div className="form__image">
        {imageExistingData && (
          <img className="form__image-item"
            src={`data:image/jpeg;base64,${imageExistingData}`}
            alt="image on file"
            width="320"
            height="240"
            margin="0.5rem 0"
          />
        )}
      </div>
      <br />
      <div className="form__button-wrapper">
      <button  className="form__button" type="submit" onClick={handleSubmit}>
        Submit
      </button>
      <button  className="form__button" type="button" onClick={handleNewForm}>
        New Form
      </button>
      </div>
    </form>
  );
}

export default Form;
