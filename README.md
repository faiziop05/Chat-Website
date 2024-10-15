# Chat Website

A modern, real-time chat platform built with React.js and Vite on the frontend, and Express.js, Socket.io, and MongoDB on the backend. The website features seamless real-time messaging, and profile image uploads via Cloudinary.


## 🖼 Screenshots
Home Screen:
 ![Home Screen](https://github.com/faiziop05/Chat-Website/blob/main/FrontEnd/UI%20Images/Screenshot%202024-10-15%20064743.png)
 
Select Emojis: 
 ![Select Emojis](https://github.com/faiziop05/Chat-Website/blob/main/FrontEnd/UI%20Images/Screenshot%202024-10-15%20064805.png) 
 
Login Screen:
 ![Login Screen](https://github.com/faiziop05/Chat-Website/blob/main/FrontEnd/UI%20Images/Screenshot%202024-10-15%20065053.png) 
 
Sign Up Screen:
 ![Sign Up Screen](https://github.com/faiziop05/Chat-Website/blob/main/FrontEnd/UI%20Images/Screenshot%202024-10-15%20065108.png) 

## 📁 Folder Structure

- **frontend:** Contains all the code related to the front-end of the application, built with React.js using Vite.
- **backend:** Built using Express.js, with Socket.io managing real-time communication, and MongoDB as the database for persistent chat and user data.

## 📜 Features

- 💬 **Real-time Messaging:** Send and receive messages in real time using Socket.io.
- 🌄 **IProfile Image Upload:** Upload profile images via Cloudinary.
- 🔄 **State Management:** Redux Toolkit manages the application state efficiently.
- 🗃️ **Data Persistence:** Messages and user data are stored in MongoDB.



## 🛠 Technologies and Packages Used

## Frontend

Here’s a list of major packages and technologies used in the app:

- **React.js**: `react 18.3.1`
- **Vite**: `vite 5.4.1`
- **React Redux**: `react-redux 9.1.2`
- **Cloudinary**: `@cloudinary/react 1.13.0`,`@cloudinary/url-gen 1.21.0`
- **Socket.io Client**: `socket.io-client 4.5.1`
- **Axios**: `axios 1.7.7`
- **React Router**: `react-router-dom 6.26.2`

## Backend

The back-end is built using Express.js with Node.js and MongoDB as the database for persistent data storage. Key technologies include:
- **Express.js:** Handles the server-side logic.
- **MongoDB:** Stores chat messages and user data.
- **Node.js:** The core runtime for the back-end.
- **Socket.io:** Enables real-time communication.

## 🚀 Installation and Setup

To get a local copy of the project up and running, follow these steps:

### Prerequisites

- Ensure that you have **Node.js** and **npm** installed on your machine.
- **MongoDB** should be set up locally or use a MongoDB cloud instance.

## Frontend Installation
1. Clone the repository.
Navigate into the frontend directory:
```bash
  cd frontend
```
2. Install the required dependencies:
```bash
  npm install
```
3. Start the development server:
```bash
  npm run dev
```

## Backend Installation
1. Clone the repository.
Navigate into the backend directory:
```bash
  cd backend
```
2. Install the required dependencies:
```bash
  npm install
```
4. Create a ``.env`` file in the root of the backend directory and add your MongoDB URI and Cloudinary configuration.
4. Start the back-end server:
```bash
  npm start
```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue.

## 📧 Contact
If you have any questions or suggestions, feel free to contact me:

Email: faizanhanif369@gmail.com

© 2024 Faizan Hanif
