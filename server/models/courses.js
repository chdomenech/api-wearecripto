const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let courseSchema = new Schema({
    code: {
        type: String,
        trim: true,
        required: [true, 'required'],
        unique: true
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'required'],        
    },
    small_description: {
        type: String
    },
    price: {
        type: Number,
        required: [true, 'required'],
    },
    image: {
        type: String        
    },
    image_id: {
        type: String        
    },
    long_description: {
        type: String        
    },
    updated_at : { 
        type: Date, 
        default: Date.now 
    },    
    status: {
        type: Boolean,
        default: false
    }
});

courseSchema.methods.toJSON = function() {
    let course = this;
    let courseObject = course.toObject();    
    return courseObject;
}

module.exports = mongoose.model('courses', courseSchema);