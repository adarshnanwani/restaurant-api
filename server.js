const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({
  path: './config/config.env'
});

// Connect to DB
connectDB();

// Load route files
const auth = require('./routes/api/auth');

// Initialize app
const app = express();

/* Apply 3rd-party middleware */

// Enable body-parser(for POST requests)
app.use(express.json());

// Enable cors
app.use(cors());

// Prevent http param pollution
app.use(hpp());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

/* Apply 3rd-party middleware ENDS*/

// Mount routers
app.use('/api/v1/auth', auth);

// Mount custom errorHandler middleware
app.use(errorHandler);

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

// Handle promise rejections and exit app gracefully
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server and exit process
  server.close(() => process.exit(1));
});
