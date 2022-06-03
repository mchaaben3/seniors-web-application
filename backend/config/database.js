const mongoose = require('mongoose')


const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI,  { useNewUrlParser: true }).then(connection => {
        console.log(`MongoDB connected with host : ${connection.connection.host} `)
    })
}

module.exports = connectDatabase