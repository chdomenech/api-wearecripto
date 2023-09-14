
const TronWeb = require('tronweb')
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
const privateKey = "c25b1ea445fbfb532e748e1eb70b4d347ab03e3e251335a43496cfaa3d347123";
const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
tronWeb.setHeader({"TRON-PRO-API-KEY": '9f427ebe-8412-4633-b0c2-4c4d245ec292'});

/** 
  * Lee balance Tron y tokens TRC10 y TRC20
  *  @param walletAddress
  *  @param blockchain
  *  @param smartContract
  *  @param symbol
  * */
 let readBalanceTRON = (walletAddress, smartContract, tokenId, symbol)  =>{
    if(smartContract === undefined && tokenId === undefined){
      return new Promise((resolve, reject) => {        
        readTRONBalance(walletAddress).then(tronBalance=>{                           
          if(tronBalance>0){
            tronBalance = tronBalance/ Math.pow(10, 6 || 0);
          }          
          const dataResponse = {walletAddress, balance:{'symbol': symbol, 'balance': tronBalance}}       
          resolve(dataResponse); 
        }).catch(errTRON => {
          reject(errTRON);       
        });
      });

  }else if(tokenId !== undefined){

    return new Promise ((resolve, reject)  => {  
      getTRC10TokenBalance(tokenId, walletAddress).then(balance=>{
        if(balance>0){
          balance = balance/ Math.pow(10, 6 || 0);
        }  
        const dataResponse = {walletAddress, balance:{'symbol': symbol, 'balance': balance}}
        resolve(dataResponse);     
      }).catch(errTRON => {
        reject(errTRON);       
      });
    });

  }else{

    return new Promise ((resolve, reject)  => {  
      getTRC20TokenBalance(smartContract, walletAddress).then(balance=>{
        if(balance>0){
          balance = balance/ Math.pow(10, 6 || 0);
        }  
        const dataResponse = {walletAddress, balance:{'symbol': symbol, 'balance': balance}}
        resolve(dataResponse);     
      }).catch(errTRON => {
        reject(errTRON);       
      });
    });

  }
}

/** 
  * Read the tokens TRC10 Balance
  *  @param smartContract
  *  @param walletAddress
  */
 let getTRC10TokenBalance = (tokenId, walletAddress) => {
  return new Promise((resolve, reject)  => {      
    
    let balanceToken = 0;      
    tronWeb.trx.getAccount(walletAddress).then(account => {
      
      if(Object.keys(account).length == 0){
        resolve(balanceToken);

      }else if(account.assetV2 !== undefined){
        account.assetV2.forEach(token => {
          const key = parseInt(token.key);
          if (key === tokenId){  
            resolve(token.value);
          }
        });
        resolve(balanceToken);
      }else{
        resolve(balanceToken);
      }      
    }).catch(errTRON3 => {
      reject(errTRON3);       
    });
  })
}


  /** 
  * Read the tokens Balance
  *  @param smartContract
  *  @param walletAddress
  */
   let getTRC20TokenBalance= (smartContract, walletAddress) => {
    return new Promise((resolve, reject)  => {  
        tronWeb.contract().at(smartContract).then(contract=>{       
          contract.decimals().call().then(decimals=>{         
            contract.balanceOf(walletAddress).call().then(trc20Balance=>{       
              let balance = tronWeb.toDecimal(trc20Balance);
              if(balance>0){
                balance = balance/ Math.pow(10, decimals || 0)        
              }
            resolve(balance); 
          }).catch(errTRON1 => {
            reject(errTRON1);       
          });
        }).catch(errTRON2 => {
          reject(errTRON2);       
        });
      }).catch(errTRON3 => {
        reject(errTRON3);       
      });
      
    });
  }
 
/**
 * Genera una wallet de tron 
 * 
 * @returns 
 */
let generateWallet = () =>{
  return new Promise((resolve, reject) => {
  tronWeb.createAccount()
  .then(result=>{        
      resolve(result);             
  }).catch(err => {      
      reject(err);          
  });
 });
}


/** 
* Read the tron balance from wallet 
* @param walletAddress
*/
let readTRONBalance = (walletAddress) =>{
  return new Promise((resolve, reject) => {    
      tronWeb.trx.getBalance(walletAddress).then(result => 
          resolve(result))
      .catch(errTRON => {
          reject(errTRON);       
      });

  });
};

module.exports = {
   generateWallet,
   readBalanceTRON
};