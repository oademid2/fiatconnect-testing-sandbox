import { BrowserProvider } from 'ethers';
import { generateNonce, SiweMessage } from 'siwe'

import { FiatConnectClient} from '@fiatconnect/fiatconnect-sdk';
import dotenv from 'dotenv'
const ethers_1 = require("ethers");

// import { SiweMessage } from 'siwe';
dotenv.config()

///////////////////////////////////////////////////////////////
/////CONFIG VARIABLES//////////////////////////////////////////
///////////////////////////////////////////////////////////////

var GATEWAY, gatewayParams;
var BASE_URL, CLIENT_API_KEY, _address;
var providerConfig;
var fiatAccountids;

const walletProvider = new BrowserProvider(window.ethereum);
var PROVIDER_CLIENT = null;

///////////////////////////////////////////////////////////////
/////CONFIG FUNCTIONS//////////////////////////////////////////
///////////////////////////////////////////////////////////////

function initGateway(){

  var gatewayName = document.getElementById("mySelect").value;

  if (gatewayName == "bitmama"){
    GATEWAY = process.env.BITMAMA
    gatewayParams = require('./mockData/bitmama').default
  }else if (gatewayName == "oneramp"){
    GATEWAY = process.env.ONERAMP
    gatewayParams = require('./mockData/oneramp').default
  }else if (gatewayName == "kotani-pay"){
    GATEWAY = process.env.KOTANIPAY
    gatewayParams = require('./mockData/oneramp').default
  }

  _address = "0xb2158dbE4B97D526cA3cb3d55E181cD8cAbFE9b1"

  providerConfig = {
      baseUrl: GATEWAY.BASE_URL,
      network: "Alfajores",
      accountAddress: _address,
      apiKey: GATEWAY.CLIENT_API_KEY,
      timeout:30 * 60 * 1000
  }

}

function connectWallet() {
  provider.send('eth_requestAccounts', [])
      .catch(() => console.log('user rejected request'));
}

//TODO: Update to better signing function
async function makeSiweMessage(){

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
  return ""
  // return signature

})

let authentication_response = await providerClient.login({issuedAt:issuedAt}).then(res => {console.log(res);return res ;})
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
    return signature

  })

  let authentication_response = await providerClient.login({issuedAt:issuedAt}).then(res => {console.log(res);return res ;})
  console.log("TEST CASE RESPONSE: Authentication Test Case: ", authentication_response)

  PROVIDER_CLIENT = providerClient;

}



///////////////////////////////////////////////////////////////
/////TEST FUNCTIONS//////////////////////////////////////////
///////////////////////////////////////////////////////////////


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function testUnprotectedCalls() {

  const providerClient = PROVIDER_CLIENT;

  console.log("**UNPROTECTED ENDPOINTS**")

  try{
    let getClockResponse = await providerClient.getClock()
    console.log("TEST CASE RESPONSE getClockResponse: ",getClockResponse)
  }catch(e){
    console.log("getClockResponse failed: ",e)
  }

  try{
    let getClockResponse = await providerClient.getClock()
    console.log("TEST CASE RESPONSE getClockResponse: ",getClockResponse)
  }catch(e){
    console.log("getClockResponse failed: ",e)
  }

  try{
    let getClockDiffApprox = await providerClient.getClockDiffApprox()
    console.log("TEST CASE RESPONSE getClockDiffApprox: ",getClockDiffApprox)
  }catch(e){
    console.log("getClockResponse failed: ",e)
  }

  try{
    let getServerTimeApprox = await providerClient.getServerTimeApprox()
  console.log("TEST CASE RESPONSE getServerTimeApprox: ",getServerTimeApprox)
  }catch(e){
    console.log("getClockResponse failed: ",e)
  }

  //isLoggedIn
  try{
    let isLoggedIn = await providerClient.isLoggedIn()
    console.log("TEST CASE RESPONSE isLoggedIn: ",isLoggedIn)
  }catch(e){
    console.log("isLoggedIn failed: ",e)
  }

}

async function testQuoteIn(createQuoteInParams){

  try{
    let createQuoteIn = await PROVIDER_CLIENT.createQuoteIn(createQuoteInParams)
    console.log("createQuoteIn: ",createQuoteIn) 
    return createQuoteIn
  }catch(e){
    console.log("createQuoteIn failed: ",e) 
    return null
  }

}

async function testQuoteOut(params){



  try{
    let createQuoteOut = await PROVIDER_CLIENT.createQuoteOut(params)
    console.log("createQuoteOut ",createQuoteOut) 
    return createQuoteOut
  }catch(e){
    console.log("createQuoteOut failed: ",e) 
    return null
  }

}


async function testTransferIn(transferParams){

  try{
    let transferIn = await PROVIDER_CLIENT.transferIn(transferParams)
    console.log("Transfer In: ", transferIn)
    return transferIn
  }catch(e){
    console.log("Transfer In failed: ", e)
    return e
  }

}

async function testTransferOut(transferParams){
  try{
    let transferOut = await PROVIDER_CLIENT.transferOut(transferParams)
    console.log("Transfer Out 1: ", transferOut)
  }catch(e){
    console.log("Transfer Out failed: ", e) //"65c7cdd388809cd5395f04a7"
  }

}


///////////////////////////////////////////////////////////////
/////TEST FUNCTIONS//////////////////////////////////////////
///////////////////////////////////////////////////////////////

function createTest(testName,data){
  var test = {}
  test.testName = testName
  test.testData = data
  return test
}



/////TRANSFER FUNCTIONS//////////////////////////////////////////

async function fullCreateTransferParams(testCase=null){
  let createQuoteIn ;

  try{
    createQuoteIn = await PROVIDER_CLIENT.createQuoteIn(gatewayParams.createQuoteParams)
    console.log("createQuoteIn: ",createQuoteIn) 
  }catch(e){
    console.log("createQuoteIn failed: ",e) 
  }

  let quote = createQuoteIn
  let quoteInId = quote.value.quote.quoteId

  let transferInParams = {data:{quoteId:"", fiatAccountId:""}, idempotencyKey:""}
  transferInParams.data.quoteId = quoteInId
  transferInParams.data.fiatAccountId = gatewayParams.transferParams.data.fiatAccountId
  transferInParams.idempotencyKey = Math.random().toString().substring(2) 

  if(testCase && testCase.testData.field == "idempotencyKey"){
    transferInParams[testCase.testData.field] = {...testCase.testData}.value;
  }else if(testCase){
    transferInParams.data[testCase.testData.field] = {...testCase.testData}.value;
  }

  return transferInParams
}

async function generateTransferInTestCases(){

  console.log("starting....")

  let testCases = []

  var fiatCases = [
    { name: "Invalid quoteId", testData: {field: "quoteId", value: "FAKE_QUOTEID"} },
    { name: "Invalid FiatAccountId", testData: {field: "fiatAccountId", value: "1234567XXX"} }
  ];

  var duplicateCases = [
    { name: "Duplicate idempotency key", testData: {field: "idempotencyKey", value: "123"} },
    { name: "Duplicate of quote", testData: {field: "quoteId", value: "FAKE_QUOTEID"} }
    ];


  for(var i=0;i<fiatCases.length;i++) {


    let testCase = fiatCases[i]

    // Call createTransferParams to get initial parameters
    let transferParams = await fullCreateTransferParams(testCase)
    testCases.push(createTest(testCase.name, {...transferParams}))


    };
    

    // Loop through each test case
    for(var i=0;i<duplicateCases.length;i++) {

      let testCase = duplicateCases[i]

      // Call createTransferParams to get initial parameters
      let transferParams = await fullCreateTransferParams()
      console.log("***",testCase.name, {...transferParams})
      let copyOfValue = transferParams.data[testCase.testData.field]
      testCases.push(createTest(testCase.name, {...transferParams}))

 



      let transferParams2 = await fullCreateTransferParams({name: testCase.name, testData:{field: testCase.testData.field, value: copyOfValue}})
      testCases.push(createTest(testCase.name+" 2", {...transferParams2}))

    };

    return testCases

}

/////QUOTE FUNCTIONS//////////////////////////////////////////

function createQuoteTestCase(fiatType, region, cryptoType, amount, country, address, isFiat=true) {
  var testCase = {};
  testCase.fiatType = fiatType;
  // testCase.region = region;
  testCase.cryptoType = cryptoType;
  if(isFiat) testCase.fiatAmount = amount;
  else testCase.cryptoAmount = amount;
  testCase.country = country;
  testCase.address = address;
  return testCase
}

function generateQuoteTests() {

  var transferConstraints = {
    maximumCryptoAmount: 2500,
    maximumFiatAmount: 4556194.43,
    minimumCryptoAmount: 0.2,
    minimumFiatAmount: 1000
  }
  
  var defaultRegion = {
    "fiatType": "UGX",
    "region": "UG",
    "country": "UG",
  
  }
  
  var quoteParamsList = [];

  var fiatAmountBelow = getRandomInt(0, transferConstraints.minimumFiatAmount).toString();
  var fiatAmountAbove = getRandomInt(transferConstraints.maximumFiatAmount + 1, transferConstraints.maximumFiatAmount + 5000).toString();
  var fiatAmountWithin = getRandomInt(transferConstraints.minimumFiatAmount + 2, transferConstraints.maximumFiatAmount-1).toString();

  var cryptoAmountBelow = getRandomInt(0, transferConstraints.minimumCryptoAmount).toString();
  var cryptoAmountAbove = getRandomInt(transferConstraints.maximumCryptoAmount + 1, transferConstraints.maximumFiatAmount + 3000).toString();
  var cryptoAmountWithin = getRandomInt(transferConstraints.minimumCryptoAmount + 2, transferConstraints.maximumCryptoAmount - 1).toString();

  var defaultRegion = {
      "fiatType": "UGX",
      "region": "UG",
      "country": "UG",
  };

  var regions = [
      { "fiatType": "UGX", "region": "UG", "country": "UG" },
      { "fiatType": "USD", "region": "US", "country": "US" },
      { "fiatType": "KES", "region": "KE", "country": "KE" }
  ];

  var defaultAddress = "0xb2158dbE4B97D526cA3cb3d55E181cD8cAbFE9b1";
  var defaultCryptoType = "cUSD";
  var defaultFiatAmount = fiatAmountWithin;

  // Generating fiat amount cases
  var fiatCases = [
      { name: "Fiat amount within the constraint", amount: fiatAmountWithin },
      { name: "Fiat amount below the constraint", amount: fiatAmountBelow },
      { name: "Fiat amount above the constraint", amount: fiatAmountAbove }
  ];

  fiatCases.forEach(function (fiatCase) {
      var quoteTestCase = createQuoteTestCase(defaultRegion.fiatType, defaultRegion.region, defaultCryptoType, fiatCase.amount, defaultRegion.country, defaultAddress, true);
      var testName = fiatCase.name;
      var test = createTest(testName, quoteTestCase);
      quoteParamsList.push(test);
  });

  // Generating crypto amount cases
  var cryptoCases = [
      { name: "Crypto amount below the constraint", amount: cryptoAmountBelow },
      { name: "Crypto amount above the constraint", amount: cryptoAmountAbove },
      { name: "Crypto amount within the constraint", amount: cryptoAmountWithin }
  ];

  cryptoCases.forEach(function (cryptoCase) {
      var quoteTestCase = createQuoteTestCase(defaultRegion.fiatType, defaultRegion.region, defaultCryptoType, cryptoCase.amount, defaultRegion.country, defaultAddress, false);
      var testName = cryptoCase.name;
      var test = createTest(testName, quoteTestCase);
      console.log("test ",test)
      quoteParamsList.push(test);
  });

  // Generating cases for each region
  regions.forEach(function (region) {
      var quoteTestCase = createQuoteTestCase(region.fiatType, region.region, defaultCryptoType, defaultFiatAmount, region.country, defaultAddress, true);
      var testName = region.region + " region";
      var test = createTest(testName, quoteTestCase);
      quoteParamsList.push(test);
  });

  //Ambiguous fiat / crypto type
  var testCase = createQuoteTestCase(defaultRegion.fiatType, defaultRegion.region, defaultCryptoType, defaultFiatAmount, defaultRegion.country, defaultAddress, true);
  var testName =  " Ambiguos fund type ";
  testCase.cryptoAmount = cryptoAmountWithin;
  var test = createTest(testName, testCase);
  quoteParamsList.push(test);
  console.log(quoteParamsList);

  var additionalCases = [
    { name: "Unsupported crypto type", testData: {field: "cryptoType", value: "xUSD"} },
    { name: "Unsupported fiat type", testData: {field: "fiatType", value: "USDD"} }
  ];

  additionalCases.forEach(function (cryptoCase) {
    var quoteTestCase = createQuoteTestCase(defaultRegion.fiatType, defaultRegion.region, defaultCryptoType, defaultFiatAmount, defaultRegion.country, defaultAddress, false);
    var testName = cryptoCase.name;
    quoteTestCase[cryptoCase.testData.field] = cryptoCase.testData.amount;
    var test = createTest(testName, quoteTestCase);
    console.log("test ",test)
    quoteParamsList.push(test);
});


  var missingParamsCases = [
    { name: "Missing country", testData: {field: "country", value: null} },
    { name: "Missing address", testData: {field: "address", value: null} },
    { name: "Missing fiattype / crypto type", testData: {field: "fiatType", value: null} }

  ];


  missingParamsCases.forEach(function (cryptoCase) {
    var quoteTestCase = createQuoteTestCase(defaultRegion.fiatType, defaultRegion.region, defaultCryptoType, defaultFiatAmount, defaultRegion.country, defaultAddress, false);
    var testName = cryptoCase.name;
    let copyQuoteTestCase = {...quoteTestCase}
    delete copyQuoteTestCase[cryptoCase.testData.field];
    var test = createTest(testName, copyQuoteTestCase);
    console.log("test ",test)
    quoteParamsList.push(test);
});



  return quoteParamsList;

  

}


/////TEST FUNCTIONS//////////////////////////////////////////

async function quickTest(){

  let getFiatAccounts = await PROVIDER_CLIENT.getFiatAccounts()
  console.log("Fiat get accounts: ", getFiatAccounts)

  let x = await PROVIDER_CLIENT.transferIn(fullCreateTransferParams())
  let transferTestCases = await generateTransferInTestCases();
  // let quoteTestCases = await generateQuoteTests();

  console.log("***** QUOTE IN TEST CASES ******")

  for(var i=0;i<quoteTestCases.length;i++) {
    let testCase = quoteTestCases[i]
    console.log(testCase)
    console.log(`Testing ${testCase.testName}`)
    let results = await testQuoteIn(testCase.testData)
    console.log(results)
  }

  for(var i=0;i<transferTestCases.length;i++) {
    let testCase = transferTestCases[i]
    console.log(testCase)
    console.log(`Testing ${testCase.testName}`)
    let results = await testTransferIn(testCase.testData)
    console.log(results)
  }


}

function testAsynchResponse(fn, params){

  async function testAsynchResponseFn(fn,params,i){
    let time_start = performance.now()

    await fn(params)
    console.log(`Async function ${i} finished in ${performance.now()-time_start}.`);
  }
  const promises = [];
  // Create and push 10 asynchronous functions into the promises array
  for (let i = 1; i <= 10; i++) {
    promises.push(testAsynchResponseFn(fn,params,i));
  }

  // Execute all promises in parallel
  Promise.all(promises)
  .then(results => {
    console.log("All async functions have completed.");
    console.log("Results:", results);
  })
  .catch(error => {
    console.error("Error occurred:", error);
  });

}

async function runTestQuotes(){

  
  let quoteTestCases = await generateQuoteTests();
  let defaulTestCase = gatewayParams.createQuoteParams;

  console.log(quoteTestCases)

  // console.log("***** QUOTE IN TEST CASES ******")

  // for(var i=0;i<quoteTestCases.length;i++) {
  //   let testCase = quoteTestCases[i]
  //   let results = await testQuoteIn(testCase.testData)
  //   console.log(`Test Case Results for : ${testCase.testName}`)
  //   console.log("Test Case Data - ", defaulTestCase)
  //   console.log("Test Case Results ",results)

  // }

  // console.log("***** QUOTE IN RAPID TEST CASES ******")

  // testAsynchResponse(testQuoteIn,defaultCase)

  // console.log("***** QUOTE OUT TEST CASES ******")

  // for(var i=0;i<quoteTestCases.length;i++) {
  //   let testCase = quoteTestCases[i]
  //   console.log(testCase)
  //   let results = await testQuoteOut(testCase.testData)
  //   console.log(`Test Case Results for : ${testCase.testName}`)
  //   console.log("Test Case Data - ", testCase)
  //   console.log("Test Case Results - ",results)  
  // }


  // console.log("***** QUOTE OUT RAPID TEST CASES ******")

  // testAsynchResponse(testQuoteOut,defaulTestCase)

  // for(var i=0;i<transferTestCases.length;i++) {
  //   let testCase = transferTestCases[i]
  //   console.log(testCase)
  //   console.log(`Testing ${testCase.testName}`)
  //   let results = await testTransferIn(testCase.testData)
  //   console.log(results)
  // }


}


async function runTestTransferStatus(){

  
  let defaultQuoteTestCase = gatewayParams.createQuoteParams;
  let quoteResponse = await testQuoteIn(defaultQuoteTestCase)
  // make transfer
  //send crypto


}


const connectWalletBtn = document.getElementById('connectWalletBtn');
const siweBtn = document.getElementById('siweBtn');
const testBtn = document.getElementById('testBtn');
const siweMsgBtn = document.getElementById('siweMsgBtn');
const testQuoteInBtn = document.getElementById('testQuoteIn');
const testTransferInBtn = document.getElementById('testTransferInBtn');
const testTransferOutBtn = document.getElementById('testTransferOutBtn');


connectWalletBtn.onclick = connectWallet;
siweBtn.onclick = signInWithEthereum;
testBtn.onclick = quickTest;
siweMsgBtn.onclick = makeSiweMessage;
testTransferInBtn.onclick = testTransferIn;
testTransferOutBtn.onclick = testTransferOut;
testQuoteInBtn.onclick = runTestQuotes;



