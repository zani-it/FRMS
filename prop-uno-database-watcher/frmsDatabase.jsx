const fs = require("fs");
const mysql = require("mysql");

// Set up the MySQL connection
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Hexano06#",
  database: "FARMS",
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database!");
});

// Set up a watcher to monitor the folder for new JSON files
const folderPath = "../prop-uno-server/jsonLibrary";
fs.watch(folderPath, (eventType, filename) => {
  if (filename.endsWith(".json")) {
    const filePath = `${folderPath}/${filename}`;

    // Read the JSON file
    const data = fs.readFileSync(filePath);

    // Parse the JSON data
    const jsonData = JSON.parse(data)[0];
    console.log(jsonData);

    // Extract the required properties from the JSON data
    const { firstName, lastName, email, sexAtBirth, dateOfBirth, age, medicalCondition, medicalSpecialty, details, image } = jsonData;
    const originalFilename = jsonData?.data?.media?.original_filename;
    const faceUuid = jsonData?.data?.media?.faces?.[0]?.face_uuid;
    const recognizeUuid = jsonData?.data?.recognize?.recognize_uuid;
    


// Build the SET clause dynamically based on the fields that have a value in the JSON file
let setClause = "";
if (firstName) setClause += `firstName='${firstName}', `;
if (lastName) setClause += `lastName='${lastName}', `;
if (sexAtBirth) setClause += `sexAtBirth='${sexAtBirth}', `;
if (dateOfBirth) setClause += `dateOfBirth='${dateOfBirth}', `;
if (age) setClause += `age='${age}', `;
if (medicalCondition) setClause += `medicalCondition='${medicalCondition}', `;
if (medicalSpecialty) setClause += `medicalSpecialty='${medicalSpecialty}', `;
if (details) setClause += `details='${details}', `;
if (faceUuid ?? '') setClause += `face_uuid='${faceUuid}', `;
if (email ?? '') setClause += `email='${email}', `;
if (recognizeUuid ?? '') setClause += `recognize_uuid='${recognizeUuid}', `;
if (originalFilename ?? '') setClause += `original_filename='${originalFilename}', `;
if (image ?? '') setClause += `image='${image}', `;

// Remove the trailing comma and space from the SET clause
setClause = setClause.slice(0, -2);

const selectQuery = `SELECT * FROM FRMSTABLE WHERE email='${email}'`;
connection.query(selectQuery, (err, rows) => {
  if (err) throw err;

  if (rows.length === 0) {
    // Email does not exist in the database, so insert a new row
    const insertQuery = `INSERT INTO FRMSTABLE (firstName, lastName, email, sexAtBirth, dateOfBirth, age, medicalCondition, medicalSpecialty, details, face_uuid, recognize_uuid, original_filename, image) VALUES ('${firstName}', '${lastName}', '${email}', '${sexAtBirth}', '${dateOfBirth}', '${age}', '${medicalCondition}', '${medicalSpecialty}', '${details}', '${faceUuid}', '${recognizeUuid}', '${originalFilename}', '${image}')`;
  
    connection.query(insertQuery, (err, result) => {
      if (err) throw err;
      console.log(`New client inserted: ${JSON.stringify(result)}`);
    });
  } else {
    // Email already exists in the database, so update the existing row
    // Build the SET clause dynamically based on the fields that have a value in the JSON file
    // ...
    const updateQuery = `UPDATE FRMSTABLE SET ${setClause} WHERE email='${email}'`;
  
    connection.query(updateQuery, (err, result) => {
      if (err) throw err;
      console.log(`Client updated: ${JSON.stringify(result)}`);
    });
  }
  
});



  }
});
