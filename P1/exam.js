const fs = require('fs');
fs.readFile('fich1.txt','utf8',(err,data) => {
    console.log("A");
});
console.log("b");
const data1 = fs.readFile('fich2.txt','utf8');
console.log("c");
//buenos dias