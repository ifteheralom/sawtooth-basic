var { makeAddress } = require('./lib');

class SimpelStoreState {
    constructor(context) {
        this.context = context;
        this.timeout = 500;
        this.stateEntries = {};
    }

    setValue(value) {
        var address = makeAddress(value[0]);
        var stateEntriesSend = {}
        stateEntriesSend[address] = Buffer.from(value[0]+','+value[1]);
        return this.context.setState(stateEntriesSend, this.timeout).then(function (result) {
            console.log("Success", result)
        }).catch(function (error) {
            console.error("Error", error)
        })
    }

    getValue(value) {
        var address = makeAddress(value[0]);
        return this.context.getState([address], this.timeout).then(function (stateEntries) {
            Object.assign(this.stateEntries, stateEntries);
            console.log(this.stateEntries[address].toString().split(','))
            // console.log(this.stateEntries);
            return this.stateEntries;
        }.bind(this))
    }
}

module.exports = SimpelStoreState
