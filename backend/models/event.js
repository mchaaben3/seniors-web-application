const mongoose  = require('mongoose')

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter the title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please enter the description'],
        trim: true
    },
    image: {
        public_id: String,
        url: String
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    members: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    }],
    location: {
        type: String,
        required: [true, 'Please enter the location'],
        trim: true
    },
    startDate: {
        type: Date,
        required: [true, 'Please enter the start date'],
        trim: true
    },
    endDate: {
        type: Date,
        required: [true, 'Please enter the end date'],
        trim: true
    }
})

module.exports = mongoose.model('Event', eventSchema)


