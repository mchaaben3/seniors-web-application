const mongoose  = require('mongoose')
const validator = require('validator')
const bcrypt    = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const postSchema = new mongoose.Schema({

    content: {
        type: String,
        required: [true, 'Please enter the content'],
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
    category: {
        type: String,
        required: [true, 'Please enter the category'],
        trim: true,
        enum: ['event', 'group', 'general']
    },
    
    likes: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    comments: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        text: {
            type: String,
            required: [true, 'Please enter your comment'],
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
})

module.exports = mongoose.model('Post', postSchema)