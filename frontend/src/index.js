import { BrowserProvider } from 'ethers';
import { generateNonce, SiweMessage } from 'siwe'
import { FiatConnectClient} from '@fiatconnect/fiatconnect-sdk';
// import bitMamaParams from './mockData/bitmama'
// import oneRampParams from './mockData/oneramp'

import dotenv from 'dotenv'
dotenv.config()

console.log(process.env)
var gatewayName = "bitmama"
var GATEWAY, gatewayParams;
var BASE_URL, CLIENT_API_KEY, _address;
var _createQuouteParams
var addFiatAccountParams
var addKycParams 
var getKycStatusParams 
var deleteKycParams

// const GATEWAY = process.env.BITMAMA
// const BASE_URL = GATEWAY.BASE_URL
// const CLIENT_API_KEY = GATEWAY.CLIENT_API_KEY
// let _address = "0xb2158dbE4B97D526cA3cb3d55E181cD8cAbFE9b1"
// console.log(GATEWAY)

// if (GATEWAY.NAME == "bitmama"){
//   gatewayParams = require('./mockData/bitmama').default
// }else if (GATEWAY.NAME == "oneramp"){
//   gatewayParams = require('./mockData/oneramp').default
// }

// var _createQuouteParams = gatewayParams._createQuouteParams
// var addFiatAccountParams = gatewayParams.addFiatAccountParams
// var addKycParams = gatewayParams.addKycParams
// var getKycStatusParams  = gatewayParams.getKycStatus
// var deleteKycParams  = gatewayParams.deleteKycParams

var providerConfig;

const walletProvider = new BrowserProvider(window.ethereum);
var PROVIDER_CLIENT = null;

function connectWallet() {
  provider.send('eth_requestAccounts', [])
      .catch(() => console.log('user rejected request'));
}

function initGateway(){

  var x = document.getElementById("mySelect").value;
  gatewayName = x;

  if (gatewayName == "bitmama"){
    GATEWAY = process.env.BITMAMA
    gatewayParams = require('./mockData/bitmama').default
  }else if (gatewayName == "oneramp"){
    GATEWAY = process.env.ONERAMP
    gatewayParams = require('./mockData/oneramp').default
  }


  BASE_URL = GATEWAY.BASE_URL
  CLIENT_API_KEY = GATEWAY.CLIENT_API_KEY
  _address = "0xb2158dbE4B97D526cA3cb3d55E181cD8cAbFE9b1"

  providerConfig = {
      baseUrl: BASE_URL,
      network: "Alfajores",
      accountAddress: _address,
      apiKey: CLIENT_API_KEY,
      timeout:30 * 60 * 1000
  }

    _createQuouteParams = gatewayParams._createQuouteParams
    addFiatAccountParams = gatewayParams.addFiatAccountParams
    addKycParams = gatewayParams.addKycParams
    getKycStatusParams  = gatewayParams.getKycStatus
    deleteKycParams  = gatewayParams.deleteKycParams

}
///ONERAMP SIWE MESSAGE FUNCTION
async function createSiweMessage() {
  try {
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + 60 * 60 * 3000); // Add 1 hour in milliseconds

    const formattedExpirationDate = expirationDate.toISOString();

    const message = new SiweMessage({
      // statement: "Sign in with Ethereum to the app.",
      address: ADDRESS,
      domain: BASE_URL.split("https://")[1],
      uri: BASE_URL,
      version: "1",
      chainId: 44787,
      nonce: generateNonce(),
      issuedAt: currentDate.toISOString(),
      expirationTime: formattedExpirationDate,
    });

    const prepared = message.prepareMessage();

    console.log("====================================");
    console.log(JSON.stringify(prepared));
    console.log("====================================");

    return prepared
  } catch (error) {
    console.log(error);
  }
}



async function signInWithEthereum() {

  initGateway()

    console.log(GATEWAY)

    const signer = await walletProvider.getSigner();
    providerConfig.accountAddress = await signer.getAddress()
    console.log("Provider config: ",providerConfig)

    let  issuedAt = new Date()//.toISOString();
     const providerClient = new FiatConnectClient(providerConfig,   async (msg)=>
    {

      let signature = await signer.signMessage(msg)

      const body = {
        message: msg,
        signature: signature
      }

      console.log("message: ", JSON.stringify(body))

      // return ""
      return signature
    })

    // let isLoggedIn = await providerClient.isLoggedIn()
    // console.log("isLoggedIn: ",isLoggedIn)
    let authentication_response = await providerClient.login({issuedAt:issuedAt}).then(res => {console.log(res);return res ;})
    console.log("authentication response: ", authentication_response)

    PROVIDER_CLIENT = providerClient;

}
async function testFunction() {

  const providerClient = PROVIDER_CLIENT;

  try{
    let getClockResponse = await providerClient.getClock()
    console.log("getClockResponse: ",getClockResponse)
  }catch{
    console.log("getClockResponse failed")
  }

  try{
    let getClockResponse = await providerClient.getClock()
    console.log("getClockResponse: ",getClockResponse)
  }catch{
    console.log("getClockResponse failed")
  }

  try{
    let getClockDiffApprox = await providerClient.getClockDiffApprox()
    console.log("getClockDiffApprox: ",getClockDiffApprox)
  }catch{
    console.log("getClockResponse failed")
  }

  try{
    let getServerTimeApprox = await providerClient.getServerTimeApprox()
  console.log("getServerTimeApprox: ",getServerTimeApprox)
  }catch{
    console.log("getClockResponse failed")
  }


  //isLoggedIn
  let isLoggedIn = await providerClient.isLoggedIn()
  console.log("isLoggedIn: ",isLoggedIn)

  let createQuoteInParams = _createQuouteParams
  let createQuoteIn = await providerClient.createQuoteIn(createQuoteInParams)
  console.log("createQuoteIn: ",createQuoteIn)

  let createQuoteOutParams = _createQuouteParams
  let createQuoteOut = await providerClient.createQuoteOut(createQuoteOutParams)
  console.log("createQuoteOut: ",createQuoteOut)

  let getQuoteInPreview = await providerClient.getQuoteInPreview(createQuoteOutParams)
  console.log("getQuoteInPreview: ",getQuoteInPreview)

  let getQuoteOutPreview = await providerClient.getQuoteOutPreview(createQuoteOutParams)
  console.log("getQuoteOutPreview: ",getQuoteOutPreview)

  let addFiatAccount = await providerClient.addFiatAccount(addFiatAccountParams)
  console.log("Fiat add account: ", addFiatAccount)
    
  let getFiatAccounts = await providerClient.getFiatAccounts()
  console.log("Fiat accounts: ", getFiatAccounts)

  let addKyc = await providerClient.addKyc(addKycParams)
  console.log("addKyc: ", addKyc)

  let getKycStatus = await providerClient.getKycStatus(getKycStatusParams)
  console.log("getKycStatus: ", getKycStatus)

  let deleteKyc = await providerClient.deleteKyc(deleteKycParams)
  console.log("deleteKyc: ", deleteKyc)

}


const connectWalletBtn = document.getElementById('connectWalletBtn');
const siweBtn = document.getElementById('siweBtn');
const testBtn = document.getElementById('testBtn');


connectWalletBtn.onclick = connectWallet;
siweBtn.onclick = signInWithEthereum;
testBtn.onclick = testFunction;