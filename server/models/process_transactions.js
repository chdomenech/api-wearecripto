const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let processTransactionsSchema = new Schema({
  transactions:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "transaction"
  }],
  content_file: {
    type: String
  },
  content_file_with_transaction: {
    type: String
  },
  wallets_amount:[{
    wallet: {
      type: String
    },
    amount: {
      type: Number
    },  
  }],
  file_name: {
    type: String
  },
  creation_date: {
    type: Date,
    default: new Date()
  },
  process_date:{
    type: Date,
  },
  status:{
    type: Number
  }
});

processTransactionsSchema.methods.toJSON = function() {

    let ProcessTransactions = this;
    let processTransactionsObject = ProcessTransactions.toObject();
    delete processTransactionsObject.__v;
    return processTransactionsObject;

}

module.exports = mongoose.model('process_transactions', processTransactionsSchema);