const crypto = require("crypto");


const TP_FAMILY = 'fabcar';

const _hash = (x) => crypto.createHash('sha512').update(x).digest('hex').toLowerCase().substring(0, 64)

const TP_NAMESPACE = _hash(TP_FAMILY).substring(0, 6);

const makeAddress = (x) => TP_NAMESPACE + _hash(x)

module.exports = {
    _hash,
    TP_FAMILY,
    TP_NAMESPACE, 
    makeAddress
}