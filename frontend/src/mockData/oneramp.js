
var fiatAccountId = "65c7ccac88809cd5395f0443"//"65c430de88809cd5395df244"

var transferConstraints = {
    maximumCryptoAmount: 2500,
    maximumFiatAmount : 1000,
    minimumCryptoAmount: 0.2,
    minimumFiatAmount: 1000
}

var _createQuouteParams = {
  "fiatType": "UGX",
  "region": "UG",
  "cryptoType": "cUSD",
  "fiatAmount": "3800",
  "country": "UG",
  "address":  "0xb2158dbE4B97D526cA3cb3d55E181cD8cAbFE9b1"
}


var createQuoteParams = {
    "fiatType": "UGX",
    "region": "UG",
    "cryptoType": "cUSD",
    "fiatAmount": "3800",
    "country": "UG",
    "address":  "0xb2158dbE4B97D526cA3cb3d55E181cD8cAbFE9b1"
  }
var createQuoteBaseParams = {
    "fiatType": "UGX",
    "region": "UG",
    "cryptoType": "cUSD",
    "fiatAmount": "3800",
    "country": "UG",
    "address":  "0xb2158dbE4B97D526cA3cb3d55E181cD8cAbFE9b1"
}


var createQuoteFiatBaseParams = {
    "fiatType": "UGX",
    "region": "UG",
    "cryptoType": "cUSD",
    "fiatAmount": "3800",
    "country": "UG",
    "address":  "0xb2158dbE4B97D526cA3cb3d55E181cD8cAbFE9b1"
}

var createQuoteCryptoBaseParams = {
    "fiatType": "UGX",
    "region": "UG",
    "cryptoType": "cUSD",
    "cryptoAmount": "1.3",
    "country": "UG",
    "address":  "0xb2158dbE4B97D526cA3cb3d55E181cD8cAbFE9b1"
}

var addFiatAccountParams = {
    "fiatAccountSchema": "MobileMoney", 
    "data": {
        "accountName": "Jovan",
        "institutionName": "My Good Wallet",
        "mobile": "2567XXXXXXXX",
        "country": "UG",
        "operator": "MTN",
        "fiatAccountType": "MobileMoney"
    }
}

    
var addKycDoc={
      "firstName": "Alice",
      "lastName": "Bob",
      "middleName": "Foo",
      "dateOfBirth": {
        "day": "12",
        "month": "4",
        "year": "1994"
      },
      "address": {
        "address1": "Bukoto SouthSide",
        "address2": "Kisuule Primary School",
        "isoCountryCode": "KE",
        "isoRegionCode": "KE",
        "city": "Kampala",
        "postalCode": "00501"
      },
      "phoneNumber": "07037205555",
      "selfieDocument": "BASE64_IMAGE",
      "identificationDocument": "BASE64_IMAGE"
}


var addKycParams = {
kycSchemaName:"PersonalDataAndDocuments",
    data:addKycDoc
}

var getKycStatusParams = { 
    kycSchema: "PersonalDataAndDocuments"
}
  
var deleteKycParams = { 
    kycSchema: "PersonalDataAndDocuments"
}


var transferParams = { 
    data:{
        quoteId: "",
        fiatAccountId :fiatAccountId,
    },

    idempotencyKey:""
}

var testCases = [
    {
        "testName": "Valid",
        "ata": {
            "data": {
                "quoteId": "7da401c0-1f68-4143-be9c-563d1c67dfee",
                "fiatAccountId": "65c430de88809cd5395df244"
            },
            "idempotencyKey": "9944200999633734"
        }
    },
    {
        "testName": "Invalid quoteId",
        "ata": {
            "data": {
                "quoteId": "7da401c0-1f68-4143-be9c-563d1c67dfee",
                "fiatAccountId": "65c430de88809cd5395df244"
            },
            "idempotencyKey": "9944200999633734"
        }
    },
    {
        "testName": "Invalid FiatAccountId",
        "ata": {
            "data": {
                "quoteId": "7da401c0-1f68-4143-be9c-563d1c67dfee",
                "fiatAccountId": "65c430de88809cd5395df244"
            },
            "idempotencyKey": "9944200999633734"
        }
    },
    {
        "testName": "Duplicate idempotency key",
        "ata": {
            "data": {
                "quoteId": "7da401c0-1f68-4143-be9c-563d1c67dfee",
                "fiatAccountId": "65c430de88809cd5395df244"
            },
            "idempotencyKey": "9944200999633734"
        }
    },
    {
        "testName": "Duplicate of quote",
        "ata": {
            "data": {
                "quoteId": "7da401c0-1f68-4143-be9c-563d1c67dfee",
                "fiatAccountId": "65c430de88809cd5395df244"
            },
            "idempotencyKey": "9944200999633734"
        }
    }
]



export default {
    _createQuouteParams,
    createQuoteParams,
    addFiatAccountParams,
    addKycParams,
    getKycStatusParams,
    deleteKycParams,
    transferParams,
    testCases
} 