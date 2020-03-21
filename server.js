const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
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

/* Apply middleware */

// Enable body-parser(for POST requests)
app.use(express.json());

// Enable cors
app.use(cors());

/* Apply middleware ENDS*/

// Mount routers
app.use('/api/v1/auth', auth);

// Mount custom errorHandler middleware
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
