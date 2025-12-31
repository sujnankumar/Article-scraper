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
    originalContent: {
        type: String,
        required: [true, 'Please add original content']
    },
    updatedContent: {
        type: String,
        default: ''
    },
    sourceUrl: {
        type: String,
        required: [true, 'Please add a source URL']
    },
    isUpdated: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // This automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Article', ArticleSchema);
