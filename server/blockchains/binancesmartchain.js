Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.NODE_POLYGON));
const axios = require('axios');
const CONST = require("../commons/constants");

/** 
* Read the tokens Balance
*  @param smartContract
*  @param wallet
*/
let getTokensNFT = (smartContract, wallet) => {

  let info = [];
  return new Promise( (resolve, reject) => {    
    const ABI = CONST.ABI_WEARECYRPTO_NFT;
    var contract = new web3.eth.Contract(ABI, smartContract);    
    contract.methods.getOwnedNftsAll(wallet).call().then( async function (result) {          
       for await (const data of result) {

        var datos = {tokenId : data.tokenId, courseCode: data.courseCode}
        info.push(datos)

        //await datosToken(data).then(dataInfo=>{info.push(dataInfo)});        
      }      
      resolve(info);
    }).catch(e => {
      console.log("error smart contract  -> ", e)
      reject(e)
    });
  });
}

/** 
* Read the tokens Balance
*  @param smartContract
*  @param wallet
*/
let getTokensNFTWAC = (smartContract, wallet) => {
  return new Promise( (resolve, reject) => {    
    const ABI = CONST.ABI_WEARECYRPTO_NFT_WAC;
    var contract = new web3.eth.Contract(ABI, smartContract);    
    contract.methods.balanceOf(wallet).call().then( async function (result) {          
      console.log(result);
      if(result>0){
        resolve(true);
      }else{
        resolve(false);
      }
    }).catch(e => {
      console.log("error smart contract  -> ", e)
      reject(e)
    });
  });
}


module.exports = {
  getTokensNFT,getTokensNFTWAC
};


