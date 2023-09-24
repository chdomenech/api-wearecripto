const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let resourceSchema = new Schema({
    module:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "modules",
        required: [true, 'required']
    },
    order: {
        type: Number,      
        required: [true, 'required']        
    },
    url: {
        type: String,
        trim: true,
        required: [true, 'required']        
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'required']        
    },
    time: {
        type: Number,      
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

});

resourceSchema.methods.toJSON = function() {
    let resource = this;
    let resourceObject = resource.toObject();    
    return resourceObject;
}

module.exports = mongoose.model('resources', resourceSchema);