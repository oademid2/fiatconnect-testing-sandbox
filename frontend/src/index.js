import { BrowserProvider, parseEther } from 'ethers';
import { generateNonce, SiweMessage } from 'siwe'

import { FiatConnectClient} from '@fiatconnect/fiatconnect-sdk';
import dotenv from 'dotenv'
// import { Wallet } from 'ethers/src.ts';
// const ethers_1 = require("ethers");

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

async function runTestOpenEndpoints() {

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


async function getInfoForTesting() {

  let accountType = gatewayParams.addFiatAccountParams.data.fiatAccountType
  console.log(accountType)

  let checkGetAccounts = await PROVIDER_CLIENT.getFiatAccounts()
  let acts = checkGetAccounts[accountType]
  console.log(checkGetAccounts)

  if(acts.length < 0){
    await testAddAccount( gatewayParams.addFiatAccountParams)
    return
  }else{
    return
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

async function fullCreateTransferParams(type="in",testCase=null){

  let createQuoteFn;
  let createQuoteIn

  if(type=="in"){
    try{
      createQuoteIn =await PROVIDER_CLIENT.createQuoteIn(gatewayParams.createQuoteParams)
      console.log(`createQuote ${type}: `,createQuoteIn) 
    }catch(e){
      console.log(`createQuote ${type} failed: `,e) 
    }}
    else{
       try{
      createQuoteIn = await PROVIDER_CLIENT.createQuoteOut(gatewayParams.createQuoteParams)
      console.log(`createQuote ${type}: `,createQuoteIn) 
    }catch(e){
      console.log(`createQuote ${type} failed: `,e) 
    }

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


async function fullCreateTransferParamsAndQuote(type="in",testCase=null){
  let createQuoteFn;
  if(type=="in"){
     createQuoteFn = PROVIDER_CLIENT.createQuoteIn;
  }else{
     createQuoteFn = PROVIDER_CLIENT.createQuoteOut;

  }

  let createQuoteIn

  try{
    createQuoteIn = await createQuoteFn(gatewayParams.createQuoteParams)
    console.log(`createQuote ${type}: `,createQuoteIn) 
  }catch(e){
    console.log(`createQuote ${type} failed: `,e) 
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

  let out = [transferInParams, createQuoteIn]

  return out
}


async function generateTransferInTestCases(type="in"){

  console.log("starting....")

  let testCases = []

  var otherCases = [
    { name: "Invalid idempotenceyKey", testData: {field: "quoteId", value: "FAKE_QUOTEID"} },
    { name: "no idempotenceyKey", testData: {field: "quoteId", value: "FAKE_QUOTEID"} },

  ];

  var fiatCases = [
    { name: "Invalid quoteId", testData: {field: "quoteId", value: "FAKE_QUOTEID"} },
    { name: "Invalid FiatAccountId", testData: {field: "fiatAccountId", value: "1234567XXX"} }
  ];

  var duplicateCases = [
    { name: "Duplicate idempotency key", testData: {field: "idempotencyKey", value: "123"} },
    { name: "Duplicate of quote", testData: {field: "quoteId", value: "FAKE_QUOTEID"} }
    ];

    {let testCase = otherCases[0]

      // Call createTransferParams to get initial parameters
      let transferParams = await fullCreateTransferParams(type,null)
      testCases.push(createTest(testCase.name, {...transferParams.data, idempotencyKey:null}))}

      let testCase = otherCases[1]

        // Call createTransferParams to get initial parameters
        let transferParams = await fullCreateTransferParams(type,testCase)
        testCases.push(createTest(testCase.name, {data:{...transferParams.data}}))


  for(var i=0;i<fiatCases.length;i++) {


    let testCase = fiatCases[i]

    // Call createTransferParams to get initial parameters
    let transferParams = await fullCreateTransferParams(type,testCase)
    testCases.push(createTest(testCase.name, {...transferParams}))


    };
    

    // Loop through each test case
    for(var i=0;i<duplicateCases.length;i++) {

      let testCase = duplicateCases[i]

      // Call createTransferParams to get initial parameters
      let transferParams = await fullCreateTransferParams(type,null)
      console.log("***",testCase.name, {...transferParams})
      let copyOfValue = transferParams.data[testCase.testData.field]
      testCases.push(createTest(testCase.name, {...transferParams}))

 



      let transferParams2 = await fullCreateTransferParams(type,{name: testCase.name, testData:{field: testCase.testData.field, value: copyOfValue}})
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

  var transferConstraints = gatewayParams.transferConstraints
  
  // var defaultRegion = {
  //   "fiatType": "UGX",
  //   "region": "UG",
  //   "country": "UG",
  
  // }

  var defaultRegion = gatewayParams.defaultRegion
  
  var quoteParamsList = [];

  var fiatAmountBelow = getRandomInt(0, transferConstraints.minimumFiatAmount).toString();
  var fiatAmountAbove = getRandomInt(transferConstraints.maximumFiatAmount + 1, transferConstraints.maximumFiatAmount + 5000).toString();
  var fiatAmountWithin = getRandomInt(transferConstraints.minimumFiatAmount + 2, transferConstraints.maximumFiatAmount-1).toString();

  var cryptoAmountBelow = getRandomInt(0, transferConstraints.minimumCryptoAmount).toString();
  var cryptoAmountAbove = getRandomInt(transferConstraints.maximumCryptoAmount + 1, transferConstraints.maximumFiatAmount + 3000).toString();
  var cryptoAmountWithin = getRandomInt(transferConstraints.minimumCryptoAmount + 2, transferConstraints.maximumCryptoAmount - 1).toString();

  // var defaultRegion = {
  //     "fiatType": "UGX",
  //     "region": "UG",
  //     "country": "UG",
  // };

  var regions = gatewayParams.regions

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


async function testAsynchResponse(fn, params,arr=false){

  async function testAsynchResponseFn(fn,params,i){
    let time_start = performance.now()

    let res ;
    if(params){
      res = await fn(params)

    }else{
      res = await fn()
    }
    console.log(`Async function ${i} finished in ${performance.now()-time_start}.`);
    return res
  }
  const promises = [];
  // Create and push 10 asynchronous functions into the promises array
  if(arr){

    for (let i = 1; i < 10; i++) {
      promises.push(testAsynchResponseFn(fn,params[i],i));
    }


  }else{
      for (let i = 1; i < 10; i++) {
      promises.push(testAsynchResponseFn(fn,params,i));
  }

  }


  // Execute all promises in parallel
   return Promise.all(promises)
  .then(results => {
    console.log("All async functions have completed.");
    console.log("Results:", results);
    return results
  })
  .catch(error => {
    console.error("Error occurred:", error);
  });

}

async function runTestQuotesIn(){

  
  let quoteTestCases = await generateQuoteTests();
  let defaulTestCase = gatewayParams.createQuoteParams;

  console.log(quoteTestCases)

  console.log("***** QUOTE IN TEST CASES ******")

  for(var i=0;i<quoteTestCases.length;i++) {
    let testCase = quoteTestCases[i]
    let results = await testQuoteIn(testCase.testData)
    console.log(`Test Case Results for : ${testCase.testName}`)
    console.log("Test Case Data - ", defaulTestCase)
    console.log("Test Case Results ",results)

  console.log("***** QUOTE IN RAPID TEST CASES ******")


}

testAsynchResponse(testQuoteIn,defaultCase)




}

async function runTestQuotesOut(){

  
  let quoteTestCases = await generateQuoteTests();
  let defaulTestCase = gatewayParams.createQuoteParams;

  console.log(quoteTestCases)

  console.log("***** QUOTE OUT TEST CASES ******")

  for(var i=0;i<quoteTestCases.length;i++) {
    let testCase = quoteTestCases[i]
    let results = await testQuoteOut(testCase.testData)
    console.log(`Test Case Results for : ${testCase.testName}`)
    console.log("Test Case Data - ", defaulTestCase)
    console.log("Test Case Results ",results)


  console.log("***** QUOTE OUT RAPID TEST CASES ******")


}

testAsynchResponse(testQuoteOut,defaulTestCase)


}

async function runTestTransferIn(){

  let transferTestCases = await generateTransferInTestCases("in");

  console.log("***** TRANSFER IN TEST CASES ******")

  for(var i=0;i<transferTestCases.length;i++) {
    let testCase = transferTestCases[i]
    console.log(testCase)
    console.log(`Testing ${testCase.testName}`)
    let results = await testTransferIn(testCase.testData)
    console.log(results)
  }

  let asynchParams = []
  for(var i=0;i<10;i++){
asynchParams.push(await fullCreateTransferParams("in"))
  }

  testAsynchResponse(testTransferIn,asynchParams,true)



}

async function runTestTransferOut(){

  let transferTestCases = await generateTransferInTestCases("out");

  console.log("***** TRANSFER OUT TEST CASES ******")

  for(var i=0;i<transferTestCases.length;i++) {
    let testCase = transferTestCases[i]
    console.log(testCase)
    console.log(`Testing ${testCase.testName}`)
    let results = await testTransferOut(testCase.testData)
    console.log(results)
  }

  let asynchParams = []

  for(var i=0;i<10;i++){
    asynchParams.push(await fullCreateTransferParams("in"))
      }
    
      testAsynchResponse(testTransferIn,asynchParams,true)
    


}


async function sendFunds(amount, receiverAddress){
    try {
      // Create signer
      const signer = await walletProvider.getSigner();      
      // Construct transaction object
      const tx = {
          to: receiverAddress,
          value: parseEther(amount.toString())
      };

      // Send transaction
      const txResponse = await signer.sendTransaction(tx);
      console.log('Transaction sent:', txResponse);
      return txResponse
  } catch (error) {
      console.error('Error sending transaction:', error);
  }
}

let timeBasedData ={
  'testTransferComplete':{id:null,status:null,data:null}

}

async function runTestTransferStatus(){


  console.log("TESTING TRANSFER STATUS:")
  
  let transferParams_ = await fullCreateTransferParamsAndQuote();
  let transferParams = transferParams_[0];
  let quoteResponse = transferParams_[1]


  console.log(transferParams_, transferParams, quoteResponse)

  let transferInResponse = await testTransferIn(transferParams)

  console.log("Transfer initiated: ")

  console.log(transferParams, transferInResponse)
  let receiverAddress_ = "0x704F357C6290D24ceDc9Ebb94BD461109C826ED4"

  let transferId  = transferInResponse.value.transferId;
  let receiverAddress = transferInResponse.value.transferAddress;
  let amountToSend = quoteResponse.value.quote.cryptoAmount.toString();
  let cryptoType = quoteResponse.value.quote.cryptoType;
  

  console.log("Asking user to send transfer: ", transferId, receiverAddress,amountToSend, cryptoType)

  timeBasedData.testTransferComplete.id = transferId

}

async function quickTransferInTest(){
  console.log("Quick Quote Test")
  let transferParams = await fullCreateTransferParams("in");
  console.log(transferParams)
  transferParams.data = {
    "quoteId": "d5cb3954-8210-46a1-a88a-d520931224cd",
    "fiatAccountId": "65c7ccac88809cd5395f0443"
  }
  let createQuoteParams = await testTransferIn(transferParams)
  console.log(createQuoteParams)
}

async function quickTransferTest(){

  // let a =  await PROVIDER_CLIENT.addFiatAccount(gatewayParams.addFiatAccountParams)
  // console.log(a)

  let act =  await PROVIDER_CLIENT.getFiatAccounts()
  console.log(act)

  let type =  "out"
  console.log("Quick Quote Test ",type)
  let transferParams = await fullCreateTransferParams("in");
  console.log(transferParams)

  let dupe = {
    "data": {
        "quoteId": "579aa72d-4338-49d5-8282-b333f0766795",
        "fiatAccountId": "65c7ccac88809cd5395f0443"
    },
    "idempotencyKey": "7248377494253897"
}

  transferParams.data.fiatAccountId =  dupe.data.fiatAccountId//"65de8e1a35cca3e0333caa66"//"65c7ccac88809cd5395f0443"
  
  
  if(type=="in"){
    let createQuoteParams = await testTransferIn(transferParams)
    console.log(createQuoteParams)
  }else{
    let createQuoteParams = await testTransferOut(transferParams)
    console.log(createQuoteParams)
    
  }

}

async function quickTransferOutTest(){
  console.log("Quick Quote Test")
  let transferParams = await fullCreateTransferParams("out");
  console.log(transferParams)
  transferParams.data = {
    "quoteId": "d5cb3954-8210-46a1-a88a-d520931224cd",
    "fiatAccountId": "65c7ccac88809cd5395f0443"
  }
  let createQuoteParams = await testTransferOut(transferParams)
  console.log(createQuoteParams)
}

async function runTestAccounts (){

  var duplicateCases = [
    { name: "Duplicate idempotency key", testData: {field: "idempotencyKey", value: "123"} },
    { name: "Duplicate of quote", testData: {field: "quoteId", value: "FAKE_QUOTEID"} }
    ];
  

  // console.log("DUPLICATE FIAT ACCOUNT ADD")
  // let addFiatAccountResponse =  await PROVIDER_CLIENT.addFiatAccount(gatewayParams.addFiatAccountParams)
  // console.log(addFiatAccountResponse)

  // addFiatAccountResponse =  await PROVIDER_CLIENT.addFiatAccount(gatewayParams.addFiatAccountParams)
  // console.log(addFiatAccountResponse)


  // console.log("DELETE PENDING")
  // var addFiatAccountResponse =  await PROVIDER_CLIENT.addFiatAccount(gatewayParams.addFiatAccountParamsPending)
  // let fiatAccountId = addFiatAccountResponse.value.fiatAccountId
  // let fiatAccount =  addFiatAccountResponse.value
  // console.log(fiatAccount)

  // let transferParams = await fullCreateTransferParams("out");
  // transferParams.data.fiatAccountId = fiatAccountId
  // let testTransferOutResponse = await testTransferOut(transferParams)

  // let deleteAccountResponse = await PROVIDER_CLIENT.deleteFiatAccount({fiatAccountId:fiatAccountId})
  // console.log({deleteAccountResponse})

  // let checkGetAccounts = await PROVIDER_CLIENT.getFiatAccounts()
  // console.log(checkGetAccounts)
  // console.log(checkGetAccounts[fiatAccount.fiatAccountType].includes(fiatAccount.fiatAccountId))

  // let status = await PROVIDER_CLIENT.getTransferStatus({fiatAccountId:"65deb66335cca3e0333caac9"})
  // console.log(status)

  // console.log("INCOMPLETE ADD")
  // var addFiatAccountResponse =  await PROVIDER_CLIENT.addFiatAccount(gatewayParams.addFiatAccountParamsIncomplete)
  // console.log(addFiatAccountResponse)

  let accountType = gatewayParams.addFiatAccountParams.data.fiatAccountType
  console.log(accountType)

  let checkGetAccounts = await PROVIDER_CLIENT.getFiatAccounts()
  let acts = checkGetAccounts[accountType]
  console.log(checkGetAccounts)


  // console.log("RAPID ADD")
  // let checkGetAccounts = await PROVIDER_CLIENT.getFiatAccounts()
  // console.log(checkGetAccounts)
  // let length_before_adding = checkGetAccounts[accountType].length
  // console.log(`length before adding : ${length_before_adding}`)

  // let asynchParams = []
  // let p = null;
  // for(var i=0;i<10;i++){
  //   p = {...gatewayParams.addFiatAccountParams}
  //   p.data.mobile = {...p}.data.mobile+i.toString()
  //   console.log({...p})
  //   asynchParams.push({...p})
  // }

  // let responses = await testAsynchResponse(testAddAccount,asynchParams,true)
  // console.log(responses)

  // checkGetAccounts = await PROVIDER_CLIENT.getFiatAccounts()
  // let length_after_adding = checkGetAccounts[accountType].length
  // console.log(`length before adding : ${length_after_adding}`)

  // console.log("RAPID Delete")
  // asynchParams = []
  // p = null;
  // for(var i=0;i<10;i++){
  //   try{
  //     asynchParams.push({fiatAccountId: responses[i].value.fiatAccountId})
  //   }catch(e){
  //     console.log(`could not parse response ${i}`, responses[i])
  //   }
  // }

  // responses = await testAsynchResponse(testDeleteAccount,asynchParams,true)
  // console.log(responses)

  // checkGetAccounts = await PROVIDER_CLIENT.getFiatAccounts()
  // let length_after_deleting = checkGetAccounts[accountType].length
  // console.log(`length before adding : ${length_after_deleting} `, length_after_deleting==length_before_adding)

  // console.log("RAPID retreive")
  // responses = await testAsynchResponse(testGetFiatAccounts,null,false)
  // console.log(responses)

  // checkGetAccounts = await PROVIDER_CLIENT.getFiatAccounts()
  // let length_after_deleting = checkGetAccounts[accountType].length
  // console.log(`length before adding : ${length_after_deleting} `, length_after_deleting==length_before_adding)

  console.log("SPECIAL CHARACTERS ADD FIAT ACCOUNT")

  var addFiatAccountResponse =  await PROVIDER_CLIENT.addFiatAccount(gatewayParams.addFiatAccountParamsSpecialCharacter)
  console.log(addFiatAccountResponse)


  console.log("BAD REGION FIAT ACCOUNT")
  var addFiatAccountResponse =  await PROVIDER_CLIENT.addFiatAccount(gatewayParams.addFiatAccountParamsBadRegion)
  console.log(addFiatAccountResponse)

  console.log("GOOD REGION FIAT ACCOUNT")
  var addFiatAccountResponse =  await PROVIDER_CLIENT.addFiatAccount(gatewayParams.addFiatAccountParams)
  console.log(addFiatAccountResponse)



  


  }

  async function testAddAccount(params){
    let res = await PROVIDER_CLIENT.addFiatAccount(params)
    console.log(res)
    return res
  }

  async function testGetFiatAccounts(){
    let res = await PROVIDER_CLIENT.getFiatAccounts()
    return res
  }


  async function testDeleteAccount(params){
    let res = await PROVIDER_CLIENT.deleteFiatAccount(params)
    return res
  }




  async function deleteAllFiatAccounts(){
    let accountType = gatewayParams.addFiatAccountParams.data.fiatAccountType
    console.log(accountType)
  
    let checkGetAccounts = await PROVIDER_CLIENT.getFiatAccounts()
    let acts = checkGetAccounts[accountType]
    console.log(checkGetAccounts)
  
    let rem
    for(var i=1;i<acts.length;i++){
      rem = await PROVIDER_CLIENT.deleteFiatAccount({fiatAccountId:acts[i].fiatAccountId})
      console.log(rem)
    }
  
  }



async function checkStatusAfterSentFunds(){
  // timeBasedData.testTransferComplete.id="65dd49a6adc94ca238ef60a5"
  if(timeBasedData.testTransferComplete.id ){
    console.log(await PROVIDER_CLIENT.getTransferStatus({transferId:timeBasedData.testTransferComplete.id}))
  }else{
    console.log("not transfer initiated")
  }
}



const connectWalletBtn = document.getElementById('connectWalletBtn');
const siweBtn = document.getElementById('siweBtn');
const testQuoteInBtn = document.getElementById('testQuoteInBtn');
const testQuoteOutBtn = document.getElementById('testQuoteOutBtn');
const testTransferInBtn = document.getElementById('testTransferInBtn');
const testTransferOutBtn = document.getElementById('testTransferOutBtn');
const testAccountsBtn = document.getElementById('testAccountsBtn');
const testOpenEndpointsBtn = document.getElementById('testOpenEndpointsBtn')
const getInfoForTestingBtn = document.getElementById('getInfoForTestingBtn')


const testOtherBtn = document.getElementById('testOtherBtn');





// const testBtn = document.getElementById('testBtn');

const checkStatusAfterSentFundsBtn = document.getElementById('checkStatusAfterSentFundsBtn');
const testQuoteIn_Btn = document.getElementById('testQuoteInTrue');

const siweMsgBtn = document.getElementById('siweMsgBtn');


connectWalletBtn.onclick = connectWallet;
siweBtn.onclick = signInWithEthereum;
testQuoteInBtn.onclick = runTestQuotesIn;
testQuoteOutBtn.onclick = runTestQuotesOut;
testTransferInBtn.onclick = runTestTransferIn;
testTransferOutBtn.onclick = runTestTransferOut;
testAccountsBtn.onclick = runTestAccounts;
testOpenEndpointsBtn.onclick = runTestOpenEndpoints;

getInfoForTestingBtn.onclick = getInfoForTesting;

// testOtherBtn.onclick = creatAccountTestCases;




// testBtn.onclick = quickTest;
siweMsgBtn.onclick = makeSiweMessage;
// testTransferInBtn.onclick = testTransferIn;
// testTransferOutBtn.onclick = testTransferOut;

testQuoteInBtn.onclick = runTestTransferStatus;
testQuoteIn_Btn.onclick = testQuoteIn_;
checkStatusAfterSentFundsBtn.onclick = checkStatusAfterSentFunds;



