Web3 = require('web3');
//const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed1.binance.org:443'));
const web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'));
const secp256k1 = require('secp256k1');
const keccak = require('keccak');
const randomBytes = require('randombytes');
const axios = require('axios');
const CONST = require("../commons/constants");
const { forEach } = require('underscore');

/** Genera una wallet */
let generateWallet = () => {
  let keyprivate = randomBytes(32);
  const pub = privateKeyToAddress(keyprivate);
  const valorKey = keccak('keccak256').update(pub).digest().slice(-20).toString('hex');
  const fromAddress = web3.utils.toChecksumAddress(valorKey.toString('hex'));
  keyprivate = keyprivate.toString('hex')
  const publikey = pub.toString('hex');
  return { publikey, keyprivate, fromAddress }
};

/**
* Generate/Read if exist a wallet with private key 
* @param privateKey
*/
function privateKeyToAddress(privateKey) {
  return secp256k1.publicKeyCreate(privateKey, false).slice(1);
}


/** 
* Read the BNB balance from wallet 
* @param walletAddress
*/
let readBSCBalance = (walletAddress) => {
  return new Promise((resolve, reject) => {
    web3.eth.getBalance(walletAddress)
      .then(function (result) {
        let cantETH = web3.utils.fromWei(result, 'ether');
        resolve(cantETH);
      }).catch(e => {
        reject(e)
        console.log("e -> ", e);
      });
  });
};



/**
 * Obtiene el total supply
 * 
 * @param {*} smartContract 
 * @returns 
 */
let getTotalSupplyBSC = (smartContract) => {
  return new Promise((resolve, reject) => {
    let minABI = [
      { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
      {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "name": "", "type": "uint8" }],
        "type": "function"
      },
    ];

    var contract = new web3.eth.Contract(minABI, smartContract);
    contract.methods.totalSupply().call((err, result) => {
      if (err) {
        console.error('Error: ', err);
      }
      const totalSupply= parseFloat(web3.utils.fromWei(result, 'ether'));
      resolve(totalSupply);
    });
  }).catch(e => {
    reject(e)
  });
}



/** 
* Read the tokens Balance
*  @param smartContract
*  @param walletAddress
*/
let getBEP20TokenBalance = (smartContract, walletAddress) => {
  return new Promise((resolve, reject) => {
    let minABI = [
      {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "name": "", "type": "uint8" }],
        "type": "function"
      }
    ];

    var contract = new web3.eth.Contract(minABI, smartContract);
    contract.methods.balanceOf(walletAddress).call().then(function (result) {
      var tokens = result;
      contract.methods.decimals().call().then(function (result) {
        var decimals = result;
        tokenBalance = parseFloat(tokens) / Math.pow(10, decimals);
        resolve(tokenBalance);
      }).catch(e => {
        console.log("error smart contract -> ", e)
        reject(e)
      });
    });
  });
}


/** 
* Read the tokens Balance
*  @param smartContract
*  @param wallet
*/
let getTokensNFT = async (smartContract, wallet) => {

  
  return new Promise(async (resolve, reject) => {    
    const ABI = CONST.ABI_WEARECYRPTO_NFT
    var contract = new web3.eth.Contract(ABI, smartContract);    
    await contract.methods.getOwnedNftsAll(wallet).call().then(function (result) {    
      
      let info =  [];
      result.forEach(data =>{        
        var data ={tokenId: data.tokenId, course: data.courseCode, json: data.json }
        info.push(data);      
      });
      resolve(info);
    }).catch(e => {
      console.log("error smart contract  -> ", e)
      reject(e)
    });
  });
}

/** 
* Lee balance Ethereum y tokens 
*  @param walletAddress
*  @param blockchain
*  @param smartContract
*  @param symbol
* */
let readBalanceBSC = (walletAddress, smartContract, symbol) => {

  if (smartContract === undefined) {
    return new Promise((resolve, reject) => {
      readBSCBalance(walletAddress).then(bnbBalance => {
        const dataResponse = { walletAddress, balance: { 'symbol': symbol, 'balance': bnbBalance } }
        resolve(dataResponse);
      }).catch(errETH => {
        reject(errETH);
      });
    });

  } else {
    return new Promise((resolve, reject) => {
      getBEP20TokenBalance(smartContract, walletAddress).then(tokenBalance => {
        const dataResponse = { walletAddress, balance: { 'symbol': symbol, 'balance': tokenBalance } }
        resolve(dataResponse);
      }).catch(errToken => {
        reject(errToken);
      });
    });
  }
}



module.exports = {
  generateWallet, readBalanceBSC, getTotalSupplyBSC,getBEP20TokenBalance, getTokensNFT
};


