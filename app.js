const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
require('./models/connection');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const uploadRoutes = require("./routes/upload");

const app = express();

const allowedOrigins = [
  "http://localhost:3001",
  "https://seesound-frontend.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.options("*", cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/upload", uploadRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = app;