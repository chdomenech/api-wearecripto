const express = require("express");
const cors = require('cors');
const emailModule = require("../middleware/sendMail");
const { templateComment } = require("../template/template_email");
const Blockchain = require("../models/blockchain");
const CryptoCurrency = require("../models/cryptocurrency");
const axios = require('axios');
const WalletUser = require("../models/wallet_user");
const {
  verificaToken,
  validateCaptcha

} = require("../middleware/autenticacion");
const app = express();
app.use(cors());

/**
 * Obtiene todas las wallets del usuario
 */
app.post("/api/commons/getAllWalletsUser", [verificaToken], (req, resp) => {
  let body = req.body;
  const usuarioId = req.usuarioid;

  WalletUser.find({ user: usuarioId }, "id walletblockchains")
    .exec((err, walletsu) => {

      if (err) {
        return resp.status(400).json({
          ok: false
        });
      }

      if (walletsu && walletsu.length > 0) {
        resp.json({
          data: walletsu[0]
        });
      } else {
        resp.json({
          data: null
        });
      }
    });

});

/**
 * Guarda las wallets del usuario
 */
app.post("/api/commons/saveWallets", [verificaToken], (req, resp) => {

  let body = req.body;
  const usuarioId = req.usuarioid;

  WalletUser.find({ user: usuarioId })
    .exec((err, walletsu) => {

      if (err) {
        return resp.status(400).json({
          ok: false
        });
      }


      if (walletsu.length > 0) {

        const update = { walletblockchains: body.walletblockchains, creation_date: new Date() }

        WalletUser.findOneAndUpdate(
          { _id: walletsu[0]._id }, update
        ).exec((err, walletUdapte) => {
          if (err) {
            return resp.status(500).json({
              ok: false,
              err,
            });
          }
          if (!walletUdapte) {
            return resp.status(400).json({
              ok: false,
              err: {
                err
              },
            });
          } else {
            resp.json({
              ok: true,
              saved: true,
            });
          }
        });
      } else if (walletsu.length == 0) {

        let walletUser = new WalletUser({
          user: usuarioId,
          walletblockchains: body.walletblockchains
        });

        walletUser.save((err, wallets) => {
          if (err) {
            return resp.status(400).json({
              ok: false,
              err,
            });
          }

          if (wallets) {
            resp.json({
              ok: true,
              saved: true,
            });
          }
        });
      }
    });
});


/** 
 * Envia comentarios
 * */
app.post("/api/commons/sendcoments", [validateCaptcha], (req, resp) => {

  let body = req.body;
  const subject = "Comment sent";
  let datos = templateComment();
  datos = datos.replace('$email', body.email);
  datos = datos.replace('$name', body.name);
  datos = datos.replace('$comment', body.comment);

  emailModule.sendEmailComent(body.name, body.email, subject, datos)
    .then(result => {
      resp.json({
        ok: true,
        send: true,
      });
    }).catch(err => {
      console.log('Error in email ', err);
      return resp.status(400).json({
        ok: false,
        err: {
          erroremail: true,
        },
      });
    });
});


/**
 * Registra un blockhain
 */
app.post("/api/commons/saveBlockchain", (req, res) => {

  let body = req.body;

  let blockchain = new Blockchain({
    name: body.name,
    timeout: body.timeout,
    image: body.image,
    symbol: body.symbol,
    status: true
  });

  blockchain.save((err, blockchain) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      saved: true,
    });
  });
});

/** 
 * Obtiene blockchain
 * */
app.post("/api/commons/getBlockchains", (req, resp) => {

  let body = req.body;

  Blockchain.find({ status: true }, "status name symbol image id timeout")
    .exec((err, blockchain) => {
      if (err) {
        return resp.status(400).json({
          ok: false,
          err,
        });
      }
      resp.json({
        ok: true,
        data: blockchain
      });
    });
});

app.post("/api/commons/getAllBlockchains", (req, resp) => {

  let body = req.body;

  Blockchain.find({}, "status name symbol image id timeout")
    .exec((err, blockchain) => {
      if (err) {
        return resp.status(400).json({
          ok: false,
          err,
        });
      }
      resp.json({
        ok: true,
        data: blockchain
      });
    });
});

/**
 * Registra una criptomoneda
 */
app.post("/api/commons/saveCryptoCurrency", (req, res) => {

  let body = req.body;

  let cryptoCurrency = new CryptoCurrency({
    name: body.name,
    url: body.url,
    image: body.image,
    symbol: body.symbol,
    blockchain: body.blockchain,
    smartcontract: body.smartcontract,
    status: true,
    blockchainSymbol: body.blockchainSymbol,
    namequery: body.namequery
  });

  cryptoCurrency.save((err, crypto) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      saved: true,
    });
  });
});

/** 
 * Obtiene criptmonedas 
 * */
app.post("/api/commons/getCryptoCurrency", (req, resp) => {

  let body = req.body;

  CryptoCurrency.find({ status: true })
    .exec((err, cryptocurrency) => {
      if (err) {
        return resp.status(400).json({
          ok: false,
          err,
        });
      }
      resp.json({
        ok: true,
        data: cryptocurrency
      });
    });
});


const getQueryCoinGecko = async (url) => {
  const resp = await axios.get(url);
  if (resp.length === 0) {
    throw new Error(`no result`);
  }
  return resp;
}

app.post("/api/commons/getCryptoCurrencyGecko", (req, resp) => {

  let body = req.body;
  let symbol = body.symbol;

  getQueryCoinGecko(body.url)
    .then(resultado => {

      return resp.json({
        ok: true,
        data: resultado.data[symbol]
      });

    }).catch(error => {
      return resp.status(400).json({
        ok: false,
        error,
      });
    });
});


/**
 * Obtiene las criptomonedas de un usuario 
 * */
app.post("/api/getCryptosByProfileById", (req, resp) => {

  const body = req.body;

  Blockchain.find({ 'status': true }, "_id name symbol")
    .exec((err, blockchains) => {
      if (err) {
        return resp.status(400).json({
          ok: false,
          err,
        });
      }

      CryptoCurrency.find(
      ).exec((err, cryptos) => {
        if (err) {
          return resp.status(500).json({
            ok: false,
            err,
          });
        }
        if (!cryptos) {
          return resp.status(400).json({
            ok: false,
            err: {
              cryptos_notfound: true,
            },
          });
        }

        let resp_crypt = [];
        blockchains.forEach(blocks_resp => {
          let blocksArray = blocks_resp;
          let cryptosArray = cryptos.filter(data => data.blockchain[0] + "" === blocksArray._id + "");
          if (cryptosArray.length > 0) {
            resp_crypt.push({ cryptosArray, blocksArray });
          }
        });

        resp.json({
          ok: true,
          cryptos: resp_crypt
        });

      });
    });
});

/**
* Obtiene el precio de TVS
*/
app.post("/api/commons/getPriceTVS", (req, resp) => {

  const urlTokensTVS = 'https://api.tovaswap.com/api/tokens';
  const urlPriceBNB = 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd';


  getPrice(urlPriceBNB).then(async result=>{     
    const BNB_PRICE = result.data.binancecoin.usd;

    await getPrice(urlTokensTVS).then(res=>{     
      const TVS_PRICE = res.data.data["0x6f1b5EA075e19c705ef9c1400f4dF9000a713930"].price_BNB;
      const TVS_BUSD = BNB_PRICE * TVS_PRICE;

      return resp.json({
        ok: true,
        TVS_price: TVS_BUSD.toFixed(9)
      });      

    }).catch(err => {      
       return resp.status(400).json({
         ok: false,
         err
       });     
   });

   }).catch(err => {      
      return resp.status(400).json({
        ok: false,
        err
      });     
  });

});


let getPrice = (url) => {
  return new Promise(async (resolve, reject) => {  
        await axios.get(url)        
        .then(result=>{
          resolve(result);
        }).catch(err => {      
          reject(err);          
        }); 
   }); 
 }


module.exports = app;