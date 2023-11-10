const express = require("express");
const cors = require('cors');
const binance = require("../blockchains/binancesmartchain");
const CONST = require("../commons/constants");
const app = express();
app.use(cors());


app.post("/api/transaction/getTokensNFT",  (req, resp) => {

  const body = req.body;
  const contract_WACNFT= CONST.SMART_CONTRACT_WEARECRYPTO_NFT

  binance.getTokensNFT(contract_WACNFT, body.wallet).then(result => {
    return resp.json({
      ok: true,
      tokens: result
    });
  }).catch(err => {
    return resp.status(400).json({
      ok: false,
      err
    });
  });
});


app.post("/api/transaction/getInfoTokenNFTWAC",  (req, resp) => {

  const body = req.body;
  const contract_WACNFT= CONST.SMART_CONTRACT_WEARECRYPTO_NFT_WAC

  binance.getTokensNFTWAC(contract_WACNFT, body.wallet).then(result => {
    return resp.json({
      ok: true,
      hastokens: result
    });
  }).catch(err => {
    return resp.status(400).json({
      ok: false,
      err
    });
  });
});




module.exports = app;