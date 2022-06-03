const mongoose  = require('mongoose')

const groupSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please enter the name'],
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
    posts: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Post'
    }]

})

module.exports = mongoose.model('Group', groupSchema)