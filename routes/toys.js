const express = require("express");
const {ToyModel, validateToy} = require("../models/toyModel")
const { auth } = require("../middlewares/auth");
const router = express.Router();


router.get("/",async(req,res) => {
  try{
    const limit = 5;
    const skip = req.query.skip || 0;
    const data = await ToyModel
    .find({})
    .limit(limit)
    .skip(skip)
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.get("/single/:id",async(req,res) => {
  try{
    const id = req.params.id;
    const data = await ToyModel.findOne({_id:id});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.get("/search",async(req,res) => {
  try{
    const searchQ = req.query.s
    const searchExp = new RegExp(searchQ, "i")
    const data = await ToyModel.find({ $or: [
        { name: searchExp },
        { info: searchExp }
      ]
    });
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.get("/category/:catName",async(req,res) => {
  const category = req.params.catName;
  const catExp = new RegExp(category, "i")
  const data = await ToyModel.find({category:catExp});
  res.json(data)
})


router.get("/count",async(req,res) => {
  try{
    const count = await ToyModel.countDocuments({})
    res.json({count});
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})


router.post("/", auth, async(req,res) => {
  const validBody = validateToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
    const toy = new ToyModel(req.body);
    toy.user_id = req.tokenData._id;
    await toy.save();
    res.json(toy)
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.put("/:id", auth, async(req,res) => {
  const validBody = validateToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
  const id = req.params.id
   const data = await ToyModel.updateOne({_id:id,user_id:req.tokenData._id},req.body)
   res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.delete("/:id", auth, async(req,res) => {
  try{
    const id = req.params.id
   const data = await ToyModel.deleteOne({_id:id,user_id:req.tokenData._id})
   res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

module.exports = router;