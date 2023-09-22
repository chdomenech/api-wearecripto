const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let moduleSchema = new Schema({
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

moduleSchema.methods.toJSON = function() {
    let module = this;
    let moduleObject = module.toObject();    
    return moduleObject;
}

module.exports = mongoose.model('modules', moduleSchema);