
var _createQuouteParams = {
  "fiatType": "UGX",
  "region": "UG",
  "cryptoType": "cUSD",
  "fiatAmount": "3800",
  // "cryptoAmount": "1.3",
  "country": "UG",
  "address":  "0xb2158dbE4B97D526cA3cb3d55E181cD8cAbFE9b1"
}


var addFiatAccountParams = { 
    "data": {
     "accountNumber": "0154300901",
     "accountName": "Red Aay", 
    "institutionName": "GTB", 
    "fiatAccountType": "bankaccount", 
    "country": "ng"
     },
     "fiatAccountSchema": "AccountNumber"
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

export default {
    _createQuouteParams,
    addFiatAccountParams,
    addKycParams,
    getKycStatusParams,
    deleteKycParams
} 