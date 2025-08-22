# defectTrackingSystem
## About This Project

The `defectTrackingSystem` is a comprehensive tool designed to help teams track, manage, and resolve defects in their software development lifecycle. It provides a centralized platform for logging issues, assigning tasks, and monitoring progress to ensure efficient defect resolution.

### Features
- **Defect Logging**: Easily log and categorize defects with detailed descriptions.
- **Task Assignment**: Assign defects to team members for resolution.
- **Status Tracking**: Monitor the status of defects from open to resolved.
- **Search and Filter**: Quickly find defects using advanced search and filtering options.
- **Integration**: Seamless integration with other tools in your development workflow.

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

#### 2. Set Up the Frontend
Navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```
Start the frontend:
```bash
npm start
```

#### 3. Set Up the Backend
Navigate to the `backend` directory and install dependencies:
```bash
cd ../backend
npm install
```
Configure the database connection in the `config/db.js` file:
```javascript
module.exports = {
    mongoURI: 'mongodb://localhost:27017/defectTrackingSystem'
};
```
Start the backend:
```bash
npm start
```

#### 4. Start MongoDB
Ensure MongoDB is running on your system. Use the following command to start MongoDB:
```bash
mongod
```

### Access the Application
Once the frontend and backend are running, open your browser and navigate to:
```
http://localhost:3000
```

You are now ready to use the `defectTrackingSystem`!