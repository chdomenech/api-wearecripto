const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let transactionSchema = new Schema({
    clientName:{
      type: String
    },    
    clientEmail:{
      type: String
    },
    clientWallet: {
      type: String
    },
    symbolToken: {
      type: String
    }, 
    tokenId:{
      type: Number
    },
    smartcontract:{
      type: String
    },
    blockchain:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "blockchain"
    }],
    blockchainSymbol: {
      type: String
    },        
    wallet:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "wallets"
    }],
    walletTransaction: {
      type: String
    },     
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_account"
    },    
    timeout: {
      type: Number
    },    
    creation_date: {
        type: Date,
        required: [true, 'required'],
    },
    processdate: {
      type: Date
    },
    status: {
        type: Number
    },    
    tovas_received: {
      type: Number
    },
    process_update:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "process_transactions"
    },
    hashTransaction: {
      type: String
    },   
    blockNumber: {
      type: Number
    },  
    transaction_logs: {
      type: String
    },

});

transactionSchema.methods.toJSON = function() {

    let transaction = this;
    let transactionObject = transaction.toObject();
    delete transactionObject.__v;
    return transactionObject;

}

module.exports = mongoose.model('transaction', transactionSchema);