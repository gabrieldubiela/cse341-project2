const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db/connect');
const supplierRoutes = require('./routes/suppliers');
const contractRoutes = require('./routes/contracts');

const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

connectDB();

app.use(bodyParser.json());
app.use(cors());

// Basic route
app.get('/', (req, res) => {
  //#swagger.tags = ['Home Page'];
  res.send('Welcome to the Suppliers and Contracts API!');
});

// API Documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc)); // New

// Use API routes
app.use('/suppliers', supplierRoutes);
app.use('/contracts', contractRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); 

    if (err.name === 'CastError') { 
        return res.status(400).json({ message: 'Invalid ID format.' });
    }
    if (err.name === 'ValidationError') {
        const errors = {};
        for (const field in err.errors) {
            errors[field] = err.errors[field].message;
        }
        return res.status(400).json({ message: 'Validation failed', errors });
    }
    if (err.code === 11000) { 
        return res.status(409).json({ message: 'Duplicate key error: A record with this value already exists.' });
    }

    // Generic error for any other issues
    res.status(500).json({ message: 'Something went wrong on the server.' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API Documentation available at http://localhost:${port}/api-docs`);
});