const mongoose = require ('mongoose');

// 1- create schema
const brandSchema = new mongoose.Schema({
    name :{
        type : String ,
        required :[true ,'brand required'],
        unique : [true , 'brand must be uniqe'] ,
        minlength : [3 , 'too short brand name'],
        maxlength : [32 , 'too long brand name '],
    },
    slug : {
        type : String ,
        lowecase : true ,
    },
    image : String,
},
    {timestamps : true }
);

//2- cteate Model
module.exports  = mongoose.model('Brand', brandSchema);
