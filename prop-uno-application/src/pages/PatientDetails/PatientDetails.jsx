import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./PatientDetails.scss";

function PatientDetails() {
  const [person, setPerson] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sexAtBirth, setSexAtBirth] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [age, setAge] = useState("");
  const [medicalCondition, setMedicalCondition] = useState("");
  const [medicalSpecialty, setMedicalSpecialty] = useState("");
  const [medicalExam, setMedicalExam] = useState("");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [imageData, setImageData] = useState(null);
  const [imageExistingData, setImageExistingData] = useState(null);
  const [medicalSpecialtyOptions, setMedicalSpecialtyOptions] = useState([
    "Cardiology",
    "Gastroenterology",
    "Neurology",
    "Orthopedics",
    "Pulmonology",
  ]);

  const [medicalExamOptions, setMedicalExamOptions] = useState([
    "Blood test",
    "X-ray",
    "MRI",
    "CT scan",
    "Ultrasound",
    "Colonoscopy",
    "Endoscopy",
    "Echocardiogram",
    "Electrocardiogram (ECG/EKG)",
    "Spirometry",
  ]);

  useEffect(() => {
    const personData = localStorage.getItem("person");
    try {
      if (personData) {
        const data = JSON.parse(personData);
        setPerson(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setSexAtBirth(data.sexAtBirth);
        setDateOfBirth(new Date(data.dateOfBirth));
        setAge(calculateAge(new Date(data.dateOfBirth)));
        setMedicalCondition(data.medicalCondition);
        setMedicalSpecialty(data.medicalSpecialty);
        setMedicalExam(data.medicalExam);

        setDetails(data.details);
        setEmail(data.email);
      }
    } catch (error) {
      console.error(error);
      // handle error
    }
  }, []);
  console.log(imageExistingData);

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

  const handleMedicalExamChange = (event) => {
    setMedicalExam(event.target.value);
  };

  const handleDetailsChange = (event) => {
    setDetails(event.target.value);
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
      medicalExam: medicalExam,
      details: details,
    };

    axios
      .post("http://localhost:3001/modify", postData)
      .then((response) => {
        const result = response.data;
        console.log(result);
        alert("Form submitted successfully!");
      })
      .catch((error) => {
        console.error(error);
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
    setMedicalExam("");
    setDetails("");
    setImageData(null);
    setImageFrozen(false);
    setImageExistingData(null);
    setImageExistingData(null);
  };

  return (
    <form className="form__body">
      <h1 className="form__header"> Patient Details</h1>
      <label className="centralized">
        <h3>Email:</h3>
        <input
          className=""
          type="email"
          value={email}
          onChange={handleEmailChange}
        />
      </label>
      <br />

      <label className="centralized">
        <h3>First Name:</h3>
        <input type="text" value={firstName} onChange={handleFirstNameChange} />
      </label>
      <br />
      <label className="centralized">
        <h3>Last Name:</h3>
        <input type="text" value={lastName} onChange={handleLastNameChange} />
      </label>
      <br />

      <label className="form__horizontal">
        <div className="centralized">
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
        </div>
        <label label className="">
          <h3> Birthday:</h3>
          <DatePicker
            selected={dateOfBirth}
            onChange={(date) => handleDateOfBirth(date)}
            maxDate={new Date()}
            showYearDropdown
            showMonthDropdown
            showDayDropdown
            dateFormat="yyyy-MM-dd"
          />
        </label>
        <label className="centralized__age">
          <h3> Age:</h3>
          <input type="number" value={age} disabled />
        </label>
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
      <label className="centralized">
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
      <label className="centralized">
        <h3>Requested Exam:</h3>
        <select value={medicalExam} onChange={handleMedicalExamChange}>
          {medicalExamOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label className="form__details centralized">
        <h3>Details:</h3>
        <textarea
          className="form__details-textarea"
          value={details}
          onChange={handleDetailsChange}
        />
      </label>
      <br />
      <div className="details__button-wrapper">
        <button
          className="details__button"
          type="submit"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <button
          className="details__button"
          type="button"
          onClick={handleNewForm}
        >
          New Form
        </button>
      </div>
    </form>
  );
}

export default PatientDetails;
