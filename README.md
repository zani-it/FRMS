
# FRMS (Fast Registry Management System)


##FRMS is a web application that simplifies patient forms for healthcare facilities. It automatically detects existing patients in waiting rooms or identification kiosks and adds them to a waitlist. Healthcare professionals can then access and edit the patient's health information form. Patients do not use the app directly, but they can view their waitlist status and medical information when they are in a private consultation with a healthcare professional. Additionally, healthcare professionals can search for their last saved form by entering their patient's email address. These added functionalities make it easier for healthcare professionals to provide quality care and for patients to manage their health information.

This application is designed to run on a local closed network. Therefore, no additional security measures have been implemented.





## API Reference

AThe API uses a general public key that is free to use. The group to check on the project is visible. To use the API, set the following:

API SET

api_key: "d45fd466-51e2-4701-8da8-04351c872236",
file_base64: base64Data,
recognize_targets: ["all@spacefrm"],
detection_min_score: 0.75,

For more information, refer to the official documentation available at: https://www.betafaceapi.com/wpa/index.php/documentation

#####

#### Detect a Face and Compare with Existing Database

Takes the image of a patient and compares it with similar landmarks for faces in the local MySQL database. If a face is found, the server updates the WebSocket-connected clients with the patient information to load the waitlist and doctor patient forms. If no face is found, it triggers the second API below:

```http
  POST /detect
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `image(base_64)` | `string` | `Image data of patient` |

#### ADD a Face to be used in the following request

Adds a patient to the database so that the patient information can be found and returned from the recognized face.

```http
  POST "https://www.betafaceapi.com/api/v2/media"
```
| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `image(base_64)` | `string` | `Image data of patient`   |
`recognize_targets` | `string`  | `all@frms.scae`|
`detection_min_score` | `number` | `Minimum detection score`|

#### Register a new user

Adds a patient to the database so that the patient information can be found and returned from the recognized face.

```http
  POST "https://www.betafaceapi.com/api/v2/media"
```

  | Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `image(base_64)` | `string` | `Image data of patient`   |
|`recognize_targets` | `string`  | `all@frms.scae`|
|`set_person_id` | `string` | `ID of person to be created` |
|`detection_min_score` | `number` | `Minimum detection score`|

##### Modify a patient information in the database

Modify a client in the mySQL database and update the clients with the new information form the mySQL database.

```http
  post /modify
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `firstName` | `string` | `Patient Name` | 
| `lastName` | `string` | `Patient Last Name` |
| `email` | `string` |  | `Patient Email` |
| `sexAtBirth` | `string` | `Patient Sex At Birth` |
| `dateOfBirth` | `string` | `Patient Date Of Birth` |
| `age` | `string` | `Patient Age` |
| `medicalCondition` | `string` | `Patient Medical Condition` |
| `medicalSpecialty` | `string` | `Patient Medical Special` |
| `details` | `string` | `Patient Details` |

#### Find a patient in the mySQL database

Return the patient information from the face recognized and autofill the form.

```http
  post /find
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email` | `string` | `email prior registered` |

## Authors

- [@zani-it @ https://github.com/zani-it]
- [@Linkedin @ https://www.linkedin.com/in/zanit/]

# Getting Started


## Clone the project

```bash
  git clone https://link-to-project
```
## Navigate to the project directory

###Go to the project directory

```bash
  cd my-project
```

# Installation

To install my-project with npm, run the following command for all the following:

- prop-uno-server
- prop-uno-database-watcher
- prop-uno-application

```bash
  npm install
```

For prop-uno-face-detection installation, force is required for the old and deprecated libraries:

```bash
  npm install --force 
```

## Starting the Application

The order in which the applications are started is important to define port numbers, as they are coded static. Follow the order below:

prop-uno-application:
```bash
  npm run start
```
prop-uno-database-watcher:
```bash
  npm run start
```

prop-uno-server:
```bash
  npm run start
```

prop-uno-face-detection:
```bash
  npm run start
```

### About the challenge

Completing a project that involves using multiple technologies such as React.js, machine learning, Sass, MySQL, REST API, Express server, and libraries in just 11 days can be quite challenging for a single developer. However, with the right motivation and dedication, it is possible to accomplish great things even as a solo developer. The project's successful completion is a testament to the developer's ability to learn new technologies quickly and efficiently, as well as their determination to produce high-quality work.