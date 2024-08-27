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

const setImageURL = (doc) => {
    if (doc.image) {
      const imageURL = `${process.env.BASE_URL}/brands/${doc.image}`;
      doc.image = imageURL;
    }
  };
  // findOne , findAll , update
  brandSchema.post("init", (doc) => {
    setImageURL(doc);
  });
  // create
  brandSchema.post("save", (doc) => {
    setImageURL(doc);
  });

//2- cteate Model
module.exports  = mongoose.model('Brand', brandSchema);
