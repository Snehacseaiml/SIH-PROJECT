const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
        }
    }
}));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// CORS middleware
app.use(cors());

// Body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

// Session configuration
app.use(session({
    secret: 'rockguard-ai-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Flash messages middleware
app.use(flash());

// Global variables middleware
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.messages = req.flash();
    next();
});

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', __dirname);

// Serve static files
app.use(express.static(__dirname));

// In-memory user storage (replace with database in production)
const users = [];

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        req.flash('error_msg', 'Please log in to access this page');
        res.redirect('/login');
    }
};

// Routes

// Home page
app.get('/', (req, res) => {
    res.render('index', {
        title: 'RockGuard AI - Rockfall Prediction System',
        user: req.session.user || null,
        messages: req.flash()
    });
});

// Login page
app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('login', {
        title: 'Login - RockGuard AI',
        error: req.flash('error')[0],
        success: req.flash('success')[0],
        email: req.flash('email')[0] || '',
        remember: req.flash('remember')[0] || false,
        messages: req.flash()
    });
});

// Login POST
app.post('/login', async (req, res) => {
    const { email, password, remember } = req.body;
    
    try {
        // Find user
        const user = users.find(u => u.email === email);
        
        if (!user) {
            req.flash('error', 'Invalid email or password');
            req.flash('email', email);
            req.flash('remember', remember);
            return res.redirect('/login');
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            req.flash('error', 'Invalid email or password');
            req.flash('email', email);
            req.flash('remember', remember);
            return res.redirect('/login');
        }
        
        // Set session
        req.session.user = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            company: user.company
        };
        
        if (remember) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        }
        
        req.flash('success', 'Login successful! Welcome back.');
        res.redirect('/dashboard');
        
    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'An error occurred during login');
        res.redirect('/login');
    }
});

// Signup page
app.get('/signup', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('signup', {
        title: 'Sign Up - RockGuard AI',
        error: req.flash('error')[0],
        success: req.flash('success')[0],
        firstName: req.flash('firstName')[0] || '',
        lastName: req.flash('lastName')[0] || '',
        email: req.flash('email')[0] || '',
        company: req.flash('company')[0] || '',
        phone: req.flash('phone')[0] || '',
        mineType: req.flash('mineType')[0] || '',
        terms: req.flash('terms')[0] || false,
        newsletter: req.flash('newsletter')[0] || false,
        messages: req.flash()
    });
});

// Signup POST
app.post('/signup', async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        company,
        phone,
        mineType,
        password,
        confirmPassword,
        terms,
        newsletter
    } = req.body;
    
    try {
        // Validation
        if (!firstName || !lastName || !email || !company || !phone || !mineType || !password || !confirmPassword) {
            req.flash('error', 'Please fill in all required fields');
            req.flash('firstName', firstName);
            req.flash('lastName', lastName);
            req.flash('email', email);
            req.flash('company', company);
            req.flash('phone', phone);
            req.flash('mineType', mineType);
            req.flash('terms', terms);
            req.flash('newsletter', newsletter);
            return res.redirect('/signup');
        }
        
        if (password !== confirmPassword) {
            req.flash('error', 'Passwords do not match');
            req.flash('firstName', firstName);
            req.flash('lastName', lastName);
            req.flash('email', email);
            req.flash('company', company);
            req.flash('phone', phone);
            req.flash('mineType', mineType);
            req.flash('terms', terms);
            req.flash('newsletter', newsletter);
            return res.redirect('/signup');
        }
        
        if (password.length < 8) {
            req.flash('error', 'Password must be at least 8 characters long');
            req.flash('firstName', firstName);
            req.flash('lastName', lastName);
            req.flash('email', email);
            req.flash('company', company);
            req.flash('phone', phone);
            req.flash('mineType', mineType);
            req.flash('terms', terms);
            req.flash('newsletter', newsletter);
            return res.redirect('/signup');
        }
        
        if (!terms) {
            req.flash('error', 'Please agree to the Terms of Service and Privacy Policy');
            req.flash('firstName', firstName);
            req.flash('lastName', lastName);
            req.flash('email', email);
            req.flash('company', company);
            req.flash('phone', phone);
            req.flash('mineType', mineType);
            req.flash('terms', terms);
            req.flash('newsletter', newsletter);
            return res.redirect('/signup');
        }
        
        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            req.flash('error', 'An account with this email already exists');
            req.flash('firstName', firstName);
            req.flash('lastName', lastName);
            req.flash('email', email);
            req.flash('company', company);
            req.flash('phone', phone);
            req.flash('mineType', mineType);
            req.flash('terms', terms);
            req.flash('newsletter', newsletter);
            return res.redirect('/signup');
        }
        
        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Create user
        const newUser = {
            id: Date.now().toString(),
            firstName,
            lastName,
            email,
            company,
            phone,
            mineType,
            password: hashedPassword,
            newsletter: newsletter === 'on',
            createdAt: new Date()
        };
        
        users.push(newUser);
        
        req.flash('success', 'Account created successfully! Please log in.');
        res.redirect('/login');
        
    } catch (error) {
        console.error('Signup error:', error);
        req.flash('error', 'An error occurred during signup');
        res.redirect('/signup');
    }
});

// Dashboard (protected route)
app.get('/dashboard', requireAuth, (req, res) => {
    res.render('dashboard', {
        title: 'Dashboard - RockGuard AI',
        user: req.session.user,
        messages: req.flash()
    });
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
});

// Forgot password page
app.get('/forgot-password', (req, res) => {
    res.render('forgot-password', {
        title: 'Forgot Password - RockGuard AI',
        error: req.flash('error')[0],
        success: req.flash('success')[0],
        messages: req.flash()
    });
});

// Forgot password POST
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    
    // In a real application, you would send an email here
    // For demo purposes, we'll just show a success message
    
    req.flash('success', 'If an account with that email exists, a password reset link has been sent.');
    res.redirect('/forgot-password');
});

// Social authentication routes (placeholder)
app.get('/auth/google', (req, res) => {
    req.flash('info', 'Google authentication coming soon!');
    res.redirect('/login');
});

app.get('/auth/microsoft', (req, res) => {
    req.flash('info', 'Microsoft authentication coming soon!');
    res.redirect('/login');
});

app.get('/auth/google/signup', (req, res) => {
    req.flash('info', 'Google signup coming soon!');
    res.redirect('/signup');
});

app.get('/auth/microsoft/signup', (req, res) => {
    req.flash('info', 'Microsoft signup coming soon!');
    res.redirect('/signup');
});

// Terms and Privacy pages
app.get('/terms', (req, res) => {
    res.render('terms', {
        title: 'Terms of Service - RockGuard AI',
        user: req.session.user || null
    });
});

app.get('/privacy', (req, res) => {
    res.render('privacy', {
        title: 'Privacy Policy - RockGuard AI',
        user: req.session.user || null
    });
});

// API routes for AJAX requests
app.get('/api/user', requireAuth, (req, res) => {
    res.json({ user: req.session.user });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Page Not Found - RockGuard AI',
        user: req.session.user || null
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Error - RockGuard AI',
        user: req.session.user || null,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 RockGuard AI server running on http://localhost:${PORT}`);
    console.log(`📧 Login: http://localhost:${PORT}/login`);
    console.log(`📝 Signup: http://localhost:${PORT}/signup`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`\n💡 Development mode: npm run dev`);
    console.log(`🌐 Production mode: npm start`);
});

