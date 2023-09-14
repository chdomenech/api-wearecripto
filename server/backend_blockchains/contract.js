const ethereum = require("../blockchains/ethereum");
const binance = require("../blockchains/binancesmartchain");
const tron = require("../blockchains/tron");
const CONST = require("../commons/constants");



/** Mintea tokens TOVA  */
let mintTokenTOVA = (public_key, private_key, smart_contract, abi, wallet,amount) =>{
    return new Promise((resolve, reject) => {    
        binance.mintTokensBEP20(public_key, private_key,smart_contract,abi,wallet,amount).then(result=>{            
            resolve(result);
        }).catch(err => {
            reject(err);       
        });        
    });
}

let burnTokensTVS = (public_key,private_key,smart_contract,abi) =>{
    return new Promise((resolve, reject) => {    
        binance.burnTokensTVS(public_key, private_key,smart_contract,abi).then(result=>{            
            resolve(result);
        }).catch(err => {
            reject(err);       
        });        
    });
}


let burnTokensBEP20 = (public_key,private_key,smart_contract,abi,wallet,amount) =>{
    return new Promise((resolve, reject) => {    
        binance.burnTokensBEP20(public_key, private_key,smart_contract,abi,wallet,amount).then(result=>{            
            resolve(result);
        }).catch(err => {
            reject(err);       
        });        
    });
}

module.exports = {
    mintTokenTOVA,
    burnTokensTVS,
    burnTokensBEP20
};

