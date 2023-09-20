const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let sectionSchema = new Schema({
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
        required: [true, 'required']
    },
    name: {
        type: String,
        trim: true,
        required: [true, 'required']        
    },        
    updated_at : { 
        type: Date, 
        default: Date.now 
    },    

});

sectionSchema.methods.toJSON = function() {
    let section = this;
    let sectionObject = section.toObject();    
    return sectionObject;
}

module.exports = mongoose.model('sections', sectionSchema);