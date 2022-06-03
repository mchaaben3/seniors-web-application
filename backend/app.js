const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/errors');
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(cookieParser());

const auth = require('./routes/authRoutes');
const postRoutes=require('./routes/postRoutes');
app.use('/api/v1', auth);
app.use('/api/v1', postRoutes);

app.use(errorMiddleware);
module.exports = app;