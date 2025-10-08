# defectTrackingSystem
## About This Project

The `defectTrackingSystem` is a comprehensive tool designed to help teams track, manage, and resolve defects in their software development lifecycle. It provides a centralized platform for logging issues, assigning tasks, and monitoring progress to ensure efficient defect resolution.

### Demo Video
For a quick overview of how the `defectTrackingSystem` works, check out the demo video located in the `assets` folder:

[![Watch the Demo](assets/demoRecording.mp4)](assets/demoRecording.mp4)


### Features
- **Defect Logging**: Easily log and categorize defects with detailed descriptions.
- **Task Assignment**: Assign defects to team members for resolution.
- **Status Tracking**: Monitor the status of defects from open to resolved.
- **Search and Filter**: Quickly find defects using advanced search and filtering options.


## Initial Setup Guide

### Prerequisites
- **Node.js**: Ensure Node.js is installed on your system.
- **MongoDB**: Install and start MongoDB.
- **Frontend Dependencies**: Install required packages for the frontend.
- **Backend Dependencies**: Install required packages for the backend.

### Steps to Set Up

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/defectTrackingSystem.git
cd defectTrackingSystem
```

#### 2. Setup MongoDB
Ensure MongoDB is installed on your system or hosted on cloud. Use the following command to start MongoDB connection in local:
```bash
sudo mongod --dbpath <mongodb data/db path here>
```
create a database named `DefectTrackingSystem` with `users` collection add record given in `backend/dbintial.json`

#### 3. Set Up the Backend
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```
Configure the database connection in the `config/db.configjs` file:
```javascript
module.exports = {
    url: 'mongodb://localhost:27017/defectTrackingSystem' //or cloud connection string
};
```
Start the backend:
```bash
npm start
```

#### 4. Set Up the Frontend
Navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```
check   "SERVER_URL" property in `config.json` to match backend server port
Start the frontend:
```bash
npm start
```




### Access the Application
Once the frontend and backend are running, open your browser and navigate to:
```
http://localhost:3000
```

You are now ready to use the `defectTrackingSystem`!