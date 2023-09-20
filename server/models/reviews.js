const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let reviewSchema = new Schema({
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
        required: [true, 'required']
    },
    wallet: {
        type: String,
        trim: true,
        required: [true, 'required']        
    },    
    comment: {
        type: String,
        trim: true,
        required: [true, 'required']
    },
    starts: {
        type: Number,
        required: [true, 'required']
    },
    updated_at : { 
        type: Date, 
        default: Date.now 
    },    

});

reviewSchema.methods.toJSON = function() {
    let review = this;
    let reviewObject = review.toObject();    
    return reviewObject;
}

module.exports = mongoose.model('reviews', reviewSchema);