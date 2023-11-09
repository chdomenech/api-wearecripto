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

/*
var datosToken = async function(data) {
  var datos = {tokenId : data.tokenId};
  try {
    const response = await axios.get(data.json);
    datos.courseCode  = response.data.code!=undefined?response.data.code: data.courseCode;
    datos.title= response.data.description!=undefined?response.data.description: null;
    datos.image= response.data.image!=undefined?response.data.image: null;
    return datos;    
  } catch (error) {
    datos.courseCode  = data.courseCode;
    return datos;
  }
}
*/



module.exports = {
  getTokensNFT
};


