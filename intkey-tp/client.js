const {createContext, CryptoFactory} = require('sawtooth-sdk/signing')
const cbor = require('cbor')
const {createHash} = require('crypto')
const {protobuf} = require('sawtooth-sdk')

// Creating a Private Key and Signer
const context = createContext('secp256k1')
const privateKey = context.newRandomPrivateKey()
const signer = new CryptoFactory(context).newSigner(privateKey)

// Encoding Your Payload
const payload = {
    Verb: 'set',
    Name: 'foo',
    Value: 42
}
const payloadBytes = cbor.encode(payload)

// Create the Transaction Header
const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    familyName: 'intkey',
    familyVersion: '1.0',
    inputs: ['1cf1266e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7'],
    outputs: ['1cf1266e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7'],
    signerPublicKey: signer.getPublicKey().asHex(),
    batcherPublicKey: signer.getPublicKey().asHex(),
    dependencies: [],
    payloadSha512: createHash('sha512').update(payloadBytes).digest('hex')
}).finish()

// Create the Transaction
const signature = signer.sign(transactionHeaderBytes)
const transaction = protobuf.Transaction.create({
    header: transactionHeaderBytes,
    headerSignature: signature,
    payload: payloadBytes
})

//  Create the BatchHeader
const transactions = [transaction]
const batchHeaderBytes = protobuf.BatchHeader.encode({
    signerPublicKey: signer.getPublicKey().asHex(),
    transactionIds: transactions.map((txn) => txn.headerSignature),
}).finish()

// Create the Batch
const headerSignature = signer.sign(batchHeaderBytes)
const batch = protobuf.Batch.create({
    header: batchHeaderBytes,
    headerSignature: headerSignature,
    transactions: transactions
})

// Encode the Batch(es) in a BatchList
const batchListBytes = protobuf.BatchList.encode({
    batches: [batch]
}).finish()

// Submitting Batches to the Validator
const request = require('request')
request.post({
    url: 'http://localhost:8008/batches',
    body: batchListBytes,
    headers: {'Content-Type': 'application/octet-stream'}
}, (err, response) => {
    if (err) return console.log(err)
    console.log(response.body)
})