const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let moduleSchema = new Schema({
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
        required: [true, 'required']
    },
    order: {
        type: Number,      
        required: [true, 'required']        
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'required']        
    },        
    status: {
        type: Boolean,
        default: false
    },
    updated_at : { 
        type: Date, 
        default: Date.now 
    },    
    resources:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "resources"        
    }],
});

moduleSchema.methods.toJSON = function() {
    let module = this;
    let moduleObject = module.toObject();    
    return moduleObject;
}

module.exports = mongoose.model('modules', moduleSchema);