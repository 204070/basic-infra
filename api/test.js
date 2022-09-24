const fs = require("fs");
const s = fs.readFileSync("./files/install_python.sh").toString();

console.log(s)