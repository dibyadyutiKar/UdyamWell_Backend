const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
require('../config/database').connect();

// Start the server
const port = process.env.PORT || 3000;

// handling the json payload
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const userRoutes = require('../routes/user');

app.use('/api', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
