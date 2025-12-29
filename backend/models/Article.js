const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    sourceUrl: {
        type: String,
        required: [true, 'Please add a source URL']
    },
    isUpdated: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Article', ArticleSchema);
