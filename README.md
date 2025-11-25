# Social Networking Site

A full-stack MERN application with admin panel for social networking.

## Features

### User Features
- User registration and login with JWT authentication
- Create, edit, delete posts with images
- Like and comment on posts
- Send and receive friend requests
- Messaging system with conversations
- Notifications for likes, comments, and friend requests
- User profile with friends list and posts
- Search for users
- Trending topics feed

### Admin Features
- User management (view, edit, delete, ban/unban users)
- Post management (view and delete posts)
- Report management system
- Dashboard with statistics
- Analytics on user engagement

## Tech Stack

**Frontend:**
- React 19 with Vite
- React Router for navigation
- Axios for API calls
- Pure CSS for styling

**Backend:**
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Setup Instructions

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Update `.env` file with your settings:
```
MONGO_URI=mongodb://localhost:27017/socialnetwork
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

3. Install dependencies:
```bash
npm install
```

4. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Update `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

3. Install dependencies:
```bash
npm install
```

4. Start development server:
```bash
npm run dev
```

App will run on `http://localhost:5173`

## API Routes

### Auth Routes
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/user/:userId` - Get user details
- `PUT /api/auth/profile` - Update profile
- `GET /api/auth/search?query=` - Search users

### Posts Routes
- `POST /api/posts` - Create post
- `GET /api/posts/feed` - Get feed
- `GET /api/posts/:postId` - Get single post
- `POST /api/posts/:postId/like` - Like post
- `POST /api/posts/:postId/comment` - Add comment
- `DELETE /api/posts/:postId` - Delete post
- `PUT /api/posts/:postId` - Edit post
- `GET /api/posts/user/:userId` - Get user posts

### Friends Routes
- `POST /api/friends/:userId/request` - Send friend request
- `POST /api/friends/:userId/accept` - Accept request
- `POST /api/friends/:userId/reject` - Reject request
- `DELETE /api/friends/:userId` - Remove friend
- `GET /api/friends/:userId` - Get user friends
- `GET /api/friends/pending/requests` - Get pending requests

### Messages Routes
- `POST /api/messages` - Send message
- `GET /api/messages` - Get conversations
- `GET /api/messages/conversation/:userId` - Get conversation

### Notifications Routes
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:notificationId/read` - Mark as read
- `PUT /api/notifications/read/all` - Mark all as read

### Admin Routes
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:userId` - Delete user
- `POST /api/admin/users/:userId/ban` - Ban user
- `POST /api/admin/users/:userId/unban` - Unban user
- `GET /api/admin/posts` - Get all posts
- `DELETE /api/admin/posts/:postId` - Delete post
- `GET /api/admin/reports` - Get all reports
- `PUT /api/admin/reports/:reportId` - Update report status
- `POST /api/admin/report` - Create report

## Database Schema

**User Model:**
- username (unique)
- email (unique)
- password (hashed)
- profilePic
- coverPhoto
- bio
- friends (array of User IDs)
- friendRequests (array with from and createdAt)
- isAdmin (boolean)
- isBanned (boolean)
- createdAt

**Post Model:**
- author (User ID)
- content
- image
- video
- likes (array of User IDs)
- comments (array with author, text, image, createdAt)
- shares (array of User IDs)
- isReported (boolean)
- createdAt

**Message Model:**
- sender (User ID)
- recipients (array of User IDs)
- content
- image
- isRead (boolean)
- createdAt

**Notification Model:**
- user (User ID)
- from (User ID)
- type (like, comment, friendRequest, friendAccepted, message)
- post (Post ID)
- message
- isRead (boolean)
- createdAt

**Report Model:**
- reportedBy (User ID)
- reportedUser (User ID)
- reportedPost (Post ID)
- reason
- description
- status (pending, reviewed, action_taken, dismissed)
- action
- createdAt

## Deployment

### Backend Deployment (Heroku/Railway)
1. Add Procfile with `web: node server.js`
2. Set environment variables on hosting platform
3. Deploy using platform's CLI

### Frontend Deployment (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy the `dist` folder
3. Set `VITE_API_URL` to your backend URL in environment variables

## Notes
- All authentication is handled via JWT tokens stored in localStorage
- Passwords are hashed using bcryptjs
- All API calls require Bearer token in Authorization header (except login/register)
- Admin routes require `isAdmin` flag on user account
- Profile pictures and post images are stored as URLs