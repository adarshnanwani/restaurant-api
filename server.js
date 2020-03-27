const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const { initCloudinary } = require('./config/fileStorage');

// Load env vars
dotenv.config({
  path: './config/config.env'
});

// Connect to DB
connectDB();

// Load route files
const auth = require('./routes/api/auth');
const menuitems = require('./routes/api/menuItems');
const orders = require('./routes/api/orders');
const restaurants = require('./routes/api/restaurants');
const images = require('./routes/api/images');

// Initialize app
const app = express();

/* Apply 3rd-party middleware */

// Enable body-parser(for POST requests)
app.use(express.json());

initCloudinary();

// Enable cors
app.use(cors());

// Cookie parser
app.use(cookieParser());

// Logger middleware for dev environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Prevent http param pollution
app.use(hpp());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

/* Apply 3rd-party middleware ENDS*/

// Mount routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/menuitems', menuitems);
app.use('/api/v1/orders', orders);
app.use('/api/v1/restaurants', restaurants);
app.use('/api/v1/images', images);

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
