require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Security and Performance Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'"],
        },
    },
}));
app.use(compression());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
    credentials: true
}));

// Rate limiting
app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static file serving
app.use(express.static('public', {
    maxAge: '1d',
    etag: true
}));

// MongoDB Connection with better error handling
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
    console.error('Error: MONGODB_URI environment variable is not set. Please set it to your MongoDB Atlas connection string.');
    process.exit(1);
}

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
}).then(() => {
    console.log('✅ Connected to MongoDB successfully');
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

// Monitor MongoDB connection
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Models
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const Blog = require('./models/Blog');
const Contact = require('./models/Contact');
const News = require('./models/News');
const Partnership = require('./models/Partnership');
const SuccessStory = require('./models/SuccessStory');
const TeamMember = require('./models/TeamMember');
const Candidate = require('./models/Candidate');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Setup file storage for CVs
const cvStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fs = require('fs');
        const path = 'public/uploads/cvs';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

const uploadCV = multer({ storage: cvStorage });

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Configure nodemailer transporter (replace with your SMTP credentials)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mailmusterhrinfo@gmail.com', // contact email
        pass: 'YOUR_APP_PASSWORD' // use an app password, not your main password
    }
});

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Public Routes for website content
app.get('/api/jobs', async (req, res) => {
    try {
        const { page = 1, limit = 10, search, location, type } = req.query;
        
        let query = { status: 'Open' };
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { department: { $regex: search, $options: 'i' } }
            ];
        }
        if (location) query.location = { $regex: location, $options: 'i' };
        if (type) query.type = type;

        const jobs = await Job.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Job.countDocuments(query);

        res.json({
            success: true,
            data: {
                jobs,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Public jobs error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
});

app.post('/api/applications', async (req, res) => {
    try {
        const application = new Application(req.body);
        await application.save();
        
        res.status(201).json({ 
            success: true,
            message: 'Application submitted successfully', 
            data: application 
        });
    } catch (error) {
        console.error('Submit application error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();

        // Send email notification
        const mailOptions = {
            from: 'mailmusterhrinfo@gmail.com',
            to: 'mailmusterhrinfo@gmail.com',
            subject: 'New Contact Form Submission',
            text: `You have received a new contact form submission:\n\nName: ${req.body.name || ''}\nEmail: ${req.body.email || ''}\nPhone: ${req.body.phone || ''}\nMessage: ${req.body.message || ''}`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending contact email:', error);
            } else {
                console.log('Contact email sent:', info.response);
            }
        });

        res.status(201).json({ 
            success: true,
            message: 'Message sent successfully' 
        });
    } catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
});

// CV Upload Route
app.post('/api/cv/upload', uploadCV.single('cvFile'), async (req, res) => {
    try {
        const { fullName, email, phone, coverLetter } = req.body;
        const cvPath = req.file.path;

        const newCandidate = new Candidate({
            fullName,
            email,
            phone,
            coverLetter,
            cvPath
        });

        await newCandidate.save();

        res.status(201).json({ 
            success: true, 
            message: 'CV uploaded successfully!',
            data: newCandidate
        });
    } catch (error) {
        console.error('CV upload error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during CV upload.'
        });
    }
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error:', err.stack);
    res.status(500).json({ 
        success: false,
        message: 'Something went wrong!' 
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ 
        success: false,
        message: 'API route not found' 
    });
});

// Serve static files and handle SPA routing
app.use(express.static('public'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Website: http://localhost:${PORT}`);
}); 