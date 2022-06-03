const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/errors');
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(cookieParser());

const auth = require('./routes/authRoutes');
const postRoutes=require('./routes/postRoutes');
const groupRoutes=require('./routes/groupRoutes');
const eventRoutes=require('./routes/eventRoutes');




app.use('/api/v1', auth);
app.use('/api/v1', postRoutes);
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/events', eventRoutes);

app.use(errorMiddleware);
module.exports = app;