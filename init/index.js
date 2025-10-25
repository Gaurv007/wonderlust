// const mongoose = require("mongoose");
// const initdata = require("./data.js");
// const listening = require("../models/listing.js");
// main().then(()=>{
//     console.log("sucessfuly connected to db.");

// }).catch(err =>{
//     console.log(err);
// })

// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
// }

// const initDB = async ()=>{
//     await listening.deleteMany({});
//    initdata.data = initdata.data.map((obj)=>({...obj,owner:"652d0081ae547c5d37e56b5f"}));
//     await listening.insertMany(initdata.data);
//     console.log("data was initialized");
// };
// initDB();

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  const ownerId = new mongoose.Types.ObjectId('68fad3cebd88d5aee145763e');
  
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: ownerId
  }));

  await Listing.insertMany(initdata.data);
  console.log("Data initialized successfully");
};

initDB();
