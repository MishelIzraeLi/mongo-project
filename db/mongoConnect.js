const mongoose = require('mongoose');
require("dotenv").config({quiet:true})

main().catch(err => console.log(err));


async function main() {
  await mongoose.connect(process.env.MONGO_DB);
  console.log("monogo connect ariel_nov26_mon local");
  
}