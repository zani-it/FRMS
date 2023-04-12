
# FRMS (Fast Registry Management System)

This application is aimed to run in a local closed network hence no further security mesures where taken.

This application manages patient forms for healthcare facilities, detects existing patients in waitrooms or identification kiosks and add their name to a waitlist.
the client that have done check in thw waitlist will have his health information form avaiable to the healthcare professional to access and edit. the form for clients also inclues acces to search by email of the patient as a functionality that loads the last saved patient form.



## API Reference

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


