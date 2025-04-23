const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const carRoutes = require('./Routes/Routes');  // Import carRoutes
const mongoose = require('mongoose');  // <-- Add this line to import mongoose


require('dotenv').config();
require('./Models/db');  // Connect to the database

const Counter = mongoose.model('counter');  // Counter model for counter initialization

// Initialize counter
async function initializeCounter() {
    const counter = await Counter.findOne({ model: 'User' });
    if (!counter) {
        await Counter.create({ model: 'User', seq: 1 }); // Set initial value if not found
    }
}

// Database connection and initialization
mongoose.connect(process.env.MONGO_CONN)
    .then(() => {
        console.log('Connected to MongoDB');
        initializeCounter();  
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });


const PORT = process.env.PORT || 8081;

// Ping route to check if the server is running
app.get('/ping', (req, res) => {
    res.send('PONG');
});

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Register the routes
app.use('/auth', AuthRouter);  // Authentication routes
app.use('/api/cars', carRoutes);  // Car-related routes

// Catch-all route for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
