# BarCode Backend API

Backend API for BarCode Inventory Management System built with Express.js, MongoDB, and Node.js.

## Features

- User registration with email verification
- OTP (One-Time Password) verification via email
- Secure login with JWT authentication
- Password hashing with bcrypt
- Input validation and error handling
- Clean code architecture

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB instance)
- Gmail account with App Password for email functionality

## Installation

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Backend directory with the following variables:
```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=appname

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d

# Email Configuration (required for OTP verification)
EMAIL_FROM=your-email@gmail.com
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in your `.env` file).

## API Endpoints

### Health Check
- **GET** `/health` - Check if server is running

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email with the OTP sent to your email.",
  "data": {
    "userId": "...",
    "email": "john@example.com"
  }
}
```

#### Login
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```

#### Verify OTP
- **POST** `/api/auth/verify-otp`
- **Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```

#### Resend OTP
- **POST** `/api/auth/resend-otp`
- **Body:**
```json
{
  "email": "john@example.com"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "OTP has been resent to your email"
}
```

## Project Structure

```
Backend/
├── config/
│   ├── database.js      # MongoDB connection
│   └── email.js         # Email service configuration
├── controllers/
│   └── authController.js # Authentication business logic
├── middleware/
│   └── validation.js    # Input validation middleware
├── models/
│   └── User.js          # User Mongoose model
├── routes/
│   └── auth.js          # Authentication routes
├── utils/
│   └── otp.js           # OTP utility functions
├── .env                 # Environment variables (not in git)
├── .gitignore
├── package.json
├── README.md
└── server.js            # Main server file
```

## Security Features

- Passwords are hashed using bcrypt before storage
- JWT tokens for authentication
- OTP expires after 10 minutes
- Input validation on all endpoints
- Email verification required before login

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error message here",
  "errors": [] // Only in validation errors
}
```

## Notes

- OTP codes are 6-digit numbers
- OTP expires 10 minutes after generation
- Users must verify their email before they can login
- JWT tokens expire after 7 days (configurable)

