const mongoose = require ('mongoose');

// 1- create schema
const categorySchema = new mongoose.Schema({
    name :{
        type : String ,
        required :[true ,'category required'],
        unique : [true , 'category must be uniqe'] ,
        minlength : [3 , 'too short category name'],
        maxlength : [32 , 'too long cantegory name '],
    },
    // A AND B => shopping.com/a-and-b
    slug : {
        type : String ,
        lowecase : true ,
    },
    image : String,
},
    {timestamps : true }
);

//2- cteate Model
const categoryModel = mongoose.model('Category', categorySchema);


module.exports = categoryModel ; 