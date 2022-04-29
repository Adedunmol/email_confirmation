require('dotenv').config();
const express = require('express');
const connectDB = require('./config/dbConnection');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middlewares/verifyJWT');
const confirmed = require('./middlewares/confirmed')
const app = express();

const PORT = process.env.PORT || 3500;

//connect to database
connectDB();

//middleware to handle form data
app.use(express.urlencoded({ extended: false }));

//middleware to handle json
app.use(express.json());

//middleware to parse cookies
app.use(cookieParser())

//register route
app.use('/register', require('./routes/register'))

//login route
app.use('/login', require('./routes/login'))

app.use('/refresh', require('./routes/refresh'))

app.use(verifyJWT)

//confirm mail route
app.use('/confirm', require('./routes/confirm'))

//get new confirmation mail route
app.use('/new-confirm', require('./routes/newConfirm'));

//middleware to check for confirmed users
app.use(confirmed);

//movies route
app.use('/movies', require('./routes/movies'));

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(3500, () => console.log(`Server listening on port ${PORT}`));
});