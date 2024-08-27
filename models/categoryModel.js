const mongoose = require("mongoose");

// 1- create schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category required"],
      unique: [true, "category must be uniqe"],
      minlength: [3, "too short category name"],
      maxlength: [32, "too long cantegory name "],
    },
    // A AND B => shopping.com/a-and-b
    slug: {
      type: String,
      lowecase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageURL;
  }
};
// findOne , findAll , update
categorySchema.post("init", (doc) => {
  setImageURL(doc);
});
// create
categorySchema.post("save", (doc) => {
  setImageURL(doc);
});

//2- cteate Model
const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;
