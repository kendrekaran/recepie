# Recipe App Deployment Guide

This is a full-stack recipe application that uses React for the frontend and Express for the backend, with Gemini AI integration for generating recipes.

## Deployment Instructions

### MongoDB Atlas Configuration

Before deploying, you need to configure your MongoDB Atlas cluster:

1. Log in to your MongoDB Atlas account
2. Navigate to your cluster's "Network Access" settings
3. Click "Add IP Address"
4. Select "Allow Access from Anywhere" (add 0.0.0.0/0) or use specific IP addresses
5. Click "Confirm"

### Backend Deployment (Vercel)

1. Push your code to GitHub
2. Create a new project on Vercel
3. Connect your GitHub repository
4. Set up the following environment variables in Vercel:
   - `MONGODB_URI` - Your MongoDB connection string with authentication details
   - `GEMINI_API_KEY` - Your Google Gemini API key
   - `CLIENT_URL` - Your production frontend URL (e.g., https://your-frontend-app.vercel.app)
   - `LOCAL_CLIENT_URL` - Your local frontend URL (e.g., http://localhost:3000)
   - `PORT` - The port number for local development (e.g., 1000)
5. Deploy the project

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Create a new project on Vercel
3. Connect your GitHub repository
4. Set up the following environment variables in Vercel:
   - `REACT_APP_API_URL` - Your production backend URL with /auth (e.g., https://your-backend-app.vercel.app/auth)
   - `REACT_APP_LOCAL_API_URL` - Your local backend URL with /auth (e.g., https://recipie-backend-nine.vercel.app/auth)
5. Deploy the project

## Local Development

### Backend

1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file with:
   ```
   PORT=1000
   MONGODB_URI=mongodb+srv://<username>:<password>@<your-cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   GEMINI_API_KEY=your_gemini_api_key
   CLIENT_URL=https://your-frontend-app.vercel.app
   LOCAL_CLIENT_URL=http://localhost:3000
   ```
4. Start the server: `npm run dev`

### Frontend

1. Navigate to the client directory: `cd client/my-app`
2. Install dependencies: `npm install`
3. Create a `.env` file with:
   ```
   REACT_APP_API_URL=https://your-backend-app.vercel.app/auth
   REACT_APP_LOCAL_API_URL=https://recipie-backend-nine.vercel.app/auth
   ```
4. Start the development server: `npm start`

## Troubleshooting

If you encounter CORS issues:
- Make sure the `CLIENT_URL` and `LOCAL_CLIENT_URL` in the backend exactly match your frontend URLs
- Check that your frontend is using the correct API URLs with the /auth path

If you encounter MongoDB connection errors:
- Verify that you've added your MongoDB Atlas connection string as an environment variable
- Make sure you've configured MongoDB Atlas to allow connections from anywhere (0.0.0.0/0)
- Check that your MongoDB Atlas user has the correct permissions
- Ensure the database name in your connection string is correct
- Verify that your MongoDB Atlas cluster is active and running

If you encounter serverless function errors:
- Make sure the backend is exporting the Express app (not a router)
- Check that your vercel.json configuration is correct 