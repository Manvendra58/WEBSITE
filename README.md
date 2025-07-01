# Muster Consultants Website

A modern, responsive website for Muster Consultants built with HTML, CSS, JavaScript, and Node.js with MongoDB integration.

## Features

- Responsive design
- Job listings and applications
- Blog posts
- Team member profiles
- Success stories
- Contact forms
- CV upload functionality
- Newsletter subscription
- MongoDB database integration
- RESTful API endpoints

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/muster-consultants.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

4. Start the development server:
```bash
npm start
```

5. Open your browser and visit:
```
http://localhost:3000
```

## Project Structure

```
muster-consultants/
├── models/            # MongoDB models
│   ├── User.js
│   ├── Job.js
│   ├── Application.js
│   ├── Blog.js
│   ├── Contact.js
│   ├── News.js
│   ├── Partnership.js
│   ├── SuccessStory.js
│   ├── TeamMember.js
│   └── Candidate.js
├── public/            # Static files
│   ├── css/          # Stylesheets
│   ├── js/           # JavaScript files
│   ├── images/       # Image assets
│   ├── index.html    # Homepage
│   ├── about.html    # About page
│   ├── contact.html  # Contact page
│   ├── services.html # Services page
│   ├── job_openings.html # Job listings
│   ├── our_team.html # Team page
│   └── upload-cv.html # CV upload page
├── server.js         # Express server
├── package.json      # Dependencies
└── README.md         # Documentation
```

## API Endpoints

### Public Endpoints
- `GET /api/jobs` - Get job listings
- `POST /api/applications` - Submit job application
- `POST /api/contact` - Submit contact form
- `POST /api/cv/upload` - Upload CV
- `GET /api/health` - Health check

## Data Management

The website uses MongoDB for data storage with the following features:

- Job listings management
- Application tracking
- Contact form submissions
- CV uploads and storage
- Blog post management

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the ISC License. 