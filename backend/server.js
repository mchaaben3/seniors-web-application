const app=require('./app');
const connectDatabase = require('./config/database')

const dotenv = require('dotenv');

dotenv.config({path: 'backend/config/config.env'});

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
    process.exit(1)
});

//database connecting
connectDatabase();
app.listen(process.env.PORT || 5050, () => {
    console.log(`server running on ${process.env.PORT} in ${process.env.NODE_ENV} mode `)
});