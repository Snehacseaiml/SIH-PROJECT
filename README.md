# RockGuard AI - Rockfall Prediction System

An advanced AI-powered rockfall prediction system designed for mining safety and risk management.

## 🚀 Features

- **Real-time Monitoring**: 24/7 AI-powered monitoring of mining zones
- **Risk Assessment**: Advanced algorithms for rockfall prediction
- **Alert System**: Instant notifications for potential hazards
- **Dashboard**: Comprehensive monitoring interface
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works on all devices

## 🛠️ Technology Stack

- **Backend**: Node.js with Express.js
- **Frontend**: EJS templating engine
- **Styling**: Custom CSS with modern design
- **Authentication**: Session-based with bcrypt password hashing
- **Security**: Helmet.js, CORS, and other security middleware

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 14.0.0 or higher)
- **npm** (comes with Node.js)

## 🚀 Quick Start

### 1. Clone or Download the Project

```bash
# If you have the files locally, navigate to the project directory
cd "rock predictor"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
# Development mode (with auto-restart)
npm run dev

# OR Production mode
npm start
```

### 4. Access the Application

Open your web browser and navigate to:
- **Homepage**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Signup**: http://localhost:3000/signup
- **Dashboard**: http://localhost:3000/dashboard (requires login)

## 📁 Project Structure

```
rock predictor/
├── server.js              # Main Express server
├── package.json           # Dependencies and scripts
├── styles.css             # Main stylesheet
├── index.ejs              # Homepage template
├── login.ejs              # Login page template
├── signup.ejs             # Signup page template
├── dashboard.ejs          # Dashboard template
├── forgot-password.ejs    # Password reset template
├── 404.ejs               # 404 error page
├── error.ejs             # General error page
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory for production settings:

```env
NODE_ENV=production
PORT=3000
SESSION_SECRET=your-super-secret-key-here
```

### Port Configuration

The application runs on port 3000 by default. You can change this by:

1. Setting the `PORT` environment variable
2. Modifying the `PORT` constant in `server.js`

## 👤 User Management

### Registration
- Users can sign up with email, password, and company information
- Passwords are securely hashed using bcrypt
- Email validation and duplicate account prevention

### Authentication
- Session-based authentication
- Remember me functionality
- Secure logout

### Demo Users
For testing purposes, you can create accounts through the signup page. All user data is stored in memory (will be lost on server restart).

## 🎨 Customization

### Styling
- Modify `styles.css` to change the appearance
- The design uses CSS Grid and Flexbox for responsive layouts
- Color scheme can be adjusted in the CSS variables

### Templates
- EJS templates can be modified in the `.ejs` files
- Server-side variables are passed to templates for dynamic content

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **Session Security**: Secure session configuration
- **CSRF Protection**: Built-in Express security
- **Content Security Policy**: Helmet.js implementation
- **Input Validation**: Server-side form validation
- **XSS Protection**: Automatic escaping in EJS

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🚨 Error Handling

- **404 Errors**: Custom 404 page for missing routes
- **500 Errors**: Server error page with development details
- **Form Validation**: Client and server-side validation
- **Flash Messages**: User-friendly error and success messages

## 🔄 Development Workflow

### Development Mode
```bash
npm run dev
```
- Uses nodemon for auto-restart on file changes
- Detailed error logging
- Development-specific error pages

### Production Mode
```bash
npm start
```
- Optimized for performance
- Minimal error details for security
- Compression enabled

## 📊 Dashboard Features

The dashboard includes:
- **Real-time Risk Map**: Visual representation of monitored zones
- **Statistics Cards**: System uptime, alerts, and monitoring status
- **Recent Alerts**: Latest notifications and warnings
- **System Status**: Component health monitoring
- **Quick Actions**: Common tasks and shortcuts

## 🔧 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   # OR change port in server.js
   ```

2. **Module Not Found**
   ```bash
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Permission Denied**
   ```bash
   # On Linux/Mac, you might need sudo
   sudo npm install
   ```

### Logs
Check the console output for detailed error messages and server logs.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Real-time WebSocket connections
- Advanced AI model integration
- Mobile app development
- API endpoints for third-party integration
- Advanced reporting and analytics
- Multi-language support
- Dark mode theme

---

**RockGuard AI** - Protecting lives through intelligent rockfall prediction.

