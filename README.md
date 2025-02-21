# Task Management Application

## Short Description

This is a task management application that allows users to organize and manage their tasks efficiently. The app provides features like task creation, sorting, and real-time updates using modern web technologies.

## Live Link

[Task Management App](https://task-ph.web.app/)

## Dependencies

The project uses the following dependencies:

- `@hello-pangea/dnd`
- `@tanstack/react-query`
- `axios`
- `firebase`
- `localforage`
- `match-sorter`
- `react`
- `react-dom`
- `react-icons`
- `react-router-dom`
- `sort-by`
- `sweetalert2`

## Installation Steps

1. Clone the repository:
   ```sh
   git clone <your-repository-link>
   ```
2. Navigate to the project directory:
   ```sh
   cd task-client
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Add a new web app and get the Firebase configuration details
   - Create a `.env` file in the project root and add your Firebase credentials:
     ```sh
     VITE_FIREBASE_API_KEY=your-api-key
     VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
     VITE_FIREBASE_PROJECT_ID=your-project-id
     VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
     VITE_FIREBASE_APP_ID=your-app-id
     ```
5. Start the development server:
   ```sh
   npm run dev
   ```

## Technologies Used

- React.js
- Firebase
- Tailwind CSS
- DaisyUI
- React Router
- React Query
- Vite
- SweetAlert2
- Mongodb
- Node
- Express
- etc.

