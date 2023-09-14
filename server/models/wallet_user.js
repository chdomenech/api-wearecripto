const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let walletUserSchema = new Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user_account"
  },
  
  walletblockchains:[
    {
      blockchain:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "blockchain"
      },
      symbol: {
        type: String
      }, 
      wallet: {
        type: String
      },      
      private_key: {
        type: String,   
        required: [true, 'requerid'],
        trim: true
      },
      public_key: {
        type: String,   
        trim: true
      },
      creation_date: {
        type: Date,
        default: new Date()
      },
      blockchain_name: {
        type: String,   
        trim: true
      }
    }
  ],
  
  creation_date: {
    type: Date,
    default: new Date()
  },
});

walletUserSchema.methods.toJSON = function() {

    let WalletUser = this;
    let walletUserObject = WalletUser.toObject();
    delete walletUserObject.__v;
    return walletUserObject;

}

module.exports = mongoose.model('wallet_user', walletUserSchema);