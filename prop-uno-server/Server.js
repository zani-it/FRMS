const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const mysql = require("mysql2/promise");
const { WebSocketServer } = require("ws");
require ('dotenv').config();



const port = process.env.PORT || 3001;

const app = express();

// Enable CORS
app.use(cors());

app.use(bodyParser.json());

const getConnection = async () => {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
};

const WebSocket = require('ws');
const WSPORT = process.env.WSPORT;

const wss = new WebSocket.Server({ port: WSPORT });

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);
  ws.on("ping", function() {
    console.log("connection active");
  });
  ws.on("open", function open() {
    ws.send("Connection Open");
  });
});


  app.post("/detect", async (req, res) => {
    try {
      const { image } = req.body;
      const base64Data = image.replace(
        /^data:image\/(png|jpeg|jpg|webp);base64,/,
        ""
      );
      const response1 = await axios.post(
        "https://www.betafaceapi.com/api/v2/media",
        {
          api_key: "d45fd466-51e2-4701-8da8-04351c872236",
          file_base64: base64Data,
          recognize_targets: ["all@spacefrm"],
          detection_min_score: 0.75,
        }
      );

      const matches = response1.data.recognize.results[0].matches || []; // Set matches to an empty array if it is null or undefined
      let matchFound = false; // Initialize matchFound to false
      let result = null;

      for (let i = 0; i < matches.length; i++) {
        const faceuuid = matches[i].face_uuid;
        const connection = await getConnection();
        const [results] = await connection.query(
          `SELECT * FROM FRMSTABLE WHERE face_uuid = '${faceuuid}'`
        );

        if (results.length > 0) {
          // A match is found
          matchFound = true; // Set matchFound to true
          console.log("A match was found", results[0]);
          result = results[0];
          wss.clients.forEach((client) => client.send(JSON.stringify(result)));
          break; // Stop iterating
        } else {
          // No match is found
          console.log(
            `No match found in the database for face_uuid: ${faceuuid}`
          );
        }
        await connection.end();
      }

      if (matchFound) {
        console.log("A match was found");
        return res.json(result);
      } else {
        console.log("No matches were found");
        return res.json("No results found");
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post("/register", async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        sexAtBirth,
        dateOfBirth,
        age,
        medicalCondition,
        medicalSpecialty,
        details,
        image,
      } = req.body;
      const base64Data = image.replace(
        /^data:image\/(png|jpeg|jpg|webp);base64,/,
        ""
      );
      const setPersonId = `${uuidv4()}@spacefrm`;
      const response2 = await axios.post(
        "https://www.betafaceapi.com/api/v2/media",
        {
          api_key: "d45fd466-51e2-4701-8da8-04351c872236",
          file_base64: base64Data,
          set_person_id: setPersonId,
          original_filename: `${setPersonId}.png`,
          recognize_targets: ["all@spacefrm"],
        }
      );

      // Create an object with the name, email, and response data
      const newEntry = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        sexAtBirth: sexAtBirth,
        dateOfBirth: dateOfBirth,
        age: age,
        medicalCondition: medicalCondition,
        medicalSpecialty: medicalSpecialty,
        details: details,
        image: base64Data,

        data: response2.data,
      };

      // Check if there is a file with a matching email
      const existingFiles = fs.readdirSync(path.join(__dirname, "jsonLibrary"));
      for (const file of existingFiles) {
        console.log("file:", file);
        const filePath = path.join(__dirname, "jsonLibrary", file);
        const fileData = JSON.parse(fs.readFileSync(filePath));
        if (fileData.email === email) {
          res.setHeader(
            "Content-disposition",
            "attachment; filename=" + fileName
          );
          res.setHeader("Content-type", "application/json");
          res.sendFile(filePath);
          console.log(fs.readFileSync(filePath));
          return;
        }
      }

      // Create a new file with the email address as the file name
      const responseFilePath = path.join(
        __dirname,
        "jsonLibrary",
        `${email}.json`
      );
      fs.writeFileSync(responseFilePath, JSON.stringify([newEntry], null, 2));
      console.log("The id file has been saved!");

      res.json(response2.data);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing request");
    }
  });


  app.post("/modify", async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        sexAtBirth,
        dateOfBirth,
        age,
        medicalCondition,
        medicalSpecialty,
        details,
      } = req.body;
  
      // Create an object with the name, email, and response data
      const newEntry = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        sexAtBirth: sexAtBirth,
        dateOfBirth: dateOfBirth,
        age: age,
        medicalCondition: medicalCondition,
        medicalSpecialty: medicalSpecialty,
        details: details,
      };
  
      // Check if there is a file with a matching email
      const existingFiles = fs.readdirSync(path.join(__dirname, "jsonLibrary"));
      let fileNameToUpdate;
      for (const file of existingFiles) {
        console.log("file:", file);
        const filePath = path.join(__dirname, "jsonLibrary", file);
        const fileData = JSON.parse(fs.readFileSync(filePath));
        if (fileData.email === email) {
          fileNameToUpdate = file;
          break;
        }
      }
  
      if (fileNameToUpdate) {
        const filePathToUpdate = path.join(
          __dirname,
          "jsonLibrary",
          fileNameToUpdate
        );
        const fileDataToUpdate = JSON.parse(fs.readFileSync(filePathToUpdate));
        fileDataToUpdate.firstName = firstName;
        fileDataToUpdate.lastName = lastName;
        fileDataToUpdate.sexAtBirth = sexAtBirth;
        fileDataToUpdate.dateOfBirth = dateOfBirth;
        fileDataToUpdate.age = age;
        fileDataToUpdate.medicalCondition = medicalCondition;
        fileDataToUpdate.medicalSpecialty = medicalSpecialty;
        fileDataToUpdate.details = details;
  
        fs.writeFileSync(filePathToUpdate, JSON.stringify(fileDataToUpdate, null, 2));
        console.log("The file has been updated!");
        res.setHeader(
          "Content-disposition",
          "attachment; filename=" + fileNameToUpdate
        );
        res.setHeader("Content-type", "application/json");
        res.sendFile(filePathToUpdate);
      } else {
        // Create a new file with the email address as the file name
        const responseFilePath = path.join(
          __dirname,
          "jsonLibrary",
          `${email}.json`
        );
        fs.writeFileSync(responseFilePath, JSON.stringify([newEntry], null, 2));
        console.log("The file has been saved!");
  
        res.status(200).send("User information has been updated successfully.");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing request");
    }
  });
  
  

  app.post("/find", (req, res) => {
    const { email, birthday } = req.body;

    // Check if there is a file with a matching email
    const fileName = `${email}.json`;
    console.log(fileName);
    const filePath = path.join(__dirname, "jsonLibrary", fileName);
    if (fs.existsSync(filePath)) {
      // Return the contents of the existing file
      res.setHeader("Content-disposition", "attachment; filename=" + fileName);
      res.setHeader("Content-type", "application/json");
      res.sendFile(filePath);
      console.log(fs.readFileSync(filePath));
      return;
    }

    // Return an error message if the file doesn't exist
    res.status(404).send("Data not found for the entered data");
  });


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
