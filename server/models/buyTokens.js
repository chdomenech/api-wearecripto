const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let buyTokensSchema = new Schema({
  
   wallet_user: {
      type: String
    },
    tokens_rojo: {
      type: Number
    }, 
    tokens_tvs:{
      type: Number
    },
    tvs_price:{
      type: Number
    },        
    creation_date: {
        type: Date,
        required: [true, 'required'],
    },    
    hashTransaction: {
      type: String
    }
});

buyTokensSchema.methods.toJSON = function() {

    let buyTokens = this;
    let buyTokensObject = buyTokens.toObject();
    delete buyTokensObject.__v;
    return buyTokensObject;

}

module.exports = mongoose.model('buy_tokens', buyTokensSchema);