let str = [10,20,30]
let buff = Buffer.from(str)
let res = []
for(const byt of buff.values()){
    res.push(byt);
}

console.log(buff);
console.log(res);
