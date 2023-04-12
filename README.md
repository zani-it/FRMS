
# FRMS (Fast Registry Management System)

This application is aimed to run in a local closed network hence no further security mesures where taken.


## This application is designed to simplify patient forms for healthcare facilities. It automatically detects existing patients in waiting rooms or identification kiosks and adds them to a waitlist. Healthcare professionals can then access and edit the patient's health information form. Patients do not use the app directly, but they can view their waitlist status and medical information when they are in a private consultation with a healthcare professional. Additionally, healthcare professionals can search for their last saved form by entering their patient's email address. These added functionalities make it easier for healthcare professionals to provide quality care and for patients to manage their health information.



## API Reference

API USE GENERAL PUBLIC KEY (FREE)
GROUP TO CHECK ON PROJECT IS VISIBLE

API SET

api_key: "d45fd466-51e2-4701-8da8-04351c872236",
          file_base64: base64Data,
          recognize_targets: ["all@spacefrm"],
          detection_min_score: 0.75,
          
API OFFICIAL DOCUMENTATION

https://www.betafaceapi.com/wpa/index.php/documentation

#####

#### Detect a Face and compare with existing database

```http
  POST /detect
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `image(base_64)` | `string` |

takes the image that was captured and copare with similar landmarks for faces in the local mySQL database if face is find the server updates the websocket connected clients with the patient information to load the waitlist and doctor patient forms.

 if no face is found it triggers the second post below:

```http
  POST "https://www.betafaceapi.com/api/v2/media"
```
| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `image(base_64)` | `string` | Required api_key    |
`recognize_targets` | `string`  |
`detection_min_score` | `number` |


Pront a form to add a patient in the database so in the future it can be found and return the patient information from the face recognized.

#### Register a new user

```http
  POST "https://www.betafaceapi.com/api/v2/media"
```

  | Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `image(base_64)` | `string` | Required api_key    |
|`recognize_targets` | `string`  |
|`set_person_id` | `string` |
|`detection_min_score` | `number` |

form to add a patient in the database so in the future it can be found and return the patient information from the face recognized.

##### Modify a patient information in the database

```http
  post /modify
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `firstName` | `string` 
| `lastName` | `string` 
| `email` | `string` 
| `sexAtBirth` | `string` 
| `dateOfBirth` | `string` 
| `age` | `string` 
| `medicalCondition` | `string` 
| `medicalSpecialty` | `string` 
| `details` | `string` | 

Modify a client in the mySQL database and update the clients with the new information form the mySQL database.

#### Find a patient in the mySQL database

```http
  post /find
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email` | `string` 

Return the patient information from the face recognized and autofill the form.




## Authors

- [@zani-it @ https://github.com/zani-it]


## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```


## Installation

Install my-project with npm 
(for all the following :
prop-uno-server
prop-uno-database-watcher
prop-uno-application
)

```bash
  npm install
```

### prop-uno-face-detection INSTALATION
(force is required for the old and deprecated libraries)

```bash
  npm install --force 
```

## Order to start application

## Order is important to define port numbers as they are coded static

prop-uno-application
```bash
  npm run start
```
prop-uno-database-watcher
```bash
  npm run start
```

prop-uno-server
```bash
  npm run start
```

prop-uno-face-detection
```bash
  npm run start
```


