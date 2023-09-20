const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let contentSchema = new Schema({
    section:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "sections",
        required: [true, 'required']
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'required']        
    },
    url: {
        type: String,
        trim: true,
        required: [true, 'required']        
    }, 
    content_type: {
        type: String,
        trim: true
    }, 
    updated_at : { 
        type: Date, 
        default: Date.now 
    }
});

contentSchema.methods.toJSON = function() {
    let content = this;
    let contentObject = content.toObject();    
    return contentObject;
}

module.exports = mongoose.model('content', contentSchema);