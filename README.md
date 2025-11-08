# BarCode - Mobile Inventory Management App

A barcode-powered mobile inventory management system built with React Native (Expo) and Node.js/Express.


# Hosted Backend Link : https://barcode-powered-mobile-inventory-app-1.onrender.com

## Project Structure

```
BarCode/
├── Backend/          # Node.js/Express API server
├── Frontend/         # React Native (Expo) mobile app
└── README.md
```

## Backend Deployment on Render

### Quick Fix for Build Error

If you're seeing the error `npm <command>` during deployment, the build command is incorrectly configured. 

### Solution 1: Using render.yaml (Recommended)

This repository includes a `render.yaml` file that configures the deployment automatically. When you connect your GitHub repository to Render, it will automatically detect and use this configuration.

**Required Steps:**
1. Make sure `render.yaml` is committed to your repository
2. In Render dashboard, create a new Web Service
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Set the following environment variables in the Render dashboard:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secret key for JWT token signing
   - `JWT_EXPIRE` - JWT expiration time (default: `7d`)
   - `EMAIL_SERVER_HOST` - SMTP server host
   - `EMAIL_SERVER_PORT` - SMTP server port (usually 587 or 465)
   - `EMAIL_SERVER_USER` - SMTP username
   - `EMAIL_SERVER_PASSWORD` - SMTP password
   - `EMAIL_FROM` - Email address to send from

### Solution 2: Manual Configuration in Render Dashboard

If you prefer to configure manually:

1. **Root Directory**: Set to `Backend`
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. **Environment**: `Node`
5. **Node Version**: `22.16.0` (or latest LTS)

### Environment Variables

The following environment variables are required for the backend to run:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key-change-in-production` |
| `JWT_EXPIRE` | JWT token expiration | `7d` (optional, defaults to 7 days) |
| `EMAIL_SERVER_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `EMAIL_SERVER_PORT` | SMTP server port | `587` |
| `EMAIL_SERVER_USER` | SMTP username | `your-email@gmail.com` |
| `EMAIL_SERVER_PASSWORD` | SMTP password | `your-app-password` |
| `EMAIL_FROM` | Email sender address | `noreply@yourapp.com` |
| `PORT` | Server port | `5000` (optional, defaults to 5000) |
| `NODE_ENV` | Environment | `production` |

### Local Development

#### Backend Setup

```bash
cd Backend
npm install
cp .env.example .env  # Create .env file with your variables
npm run dev          # Start development server with nodemon
```

#### Frontend Setup

```bash
cd Frontend
npm install
npm start            # Start Expo development server
```

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category

## Troubleshooting

### Build Command Error
If you see `npm <command>` error, ensure:
- Root directory is set to `Backend` in Render dashboard
- Build command is `npm install`
- Start command is `npm start`

### MongoDB Connection Issues
- Verify your `MONGODB_URI` is correct
- Check if your MongoDB cluster allows connections from Render's IP addresses
- Ensure your MongoDB user has proper permissions

### Email Configuration Issues
- For Gmail, use an App Password instead of your regular password
- Verify SMTP settings match your email provider's requirements
- Check firewall/security settings that might block SMTP connections
