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
    res.status(500).send('Something broke!');
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API Documentation available at http://localhost:${port}/api-docs`);
});