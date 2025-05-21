const mongoose = require("mongoose");
const reviews = require("./reviews.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
      // type: String,
      // default:
      //   "https://unsplash.com/photos/a-restaurant-with-tables-and-chairs-outside-of-it-u9pc2Ss1fCU",
      // set: (v) =>
      //   v === ""
      //     ? "https://unsplash.com/photos/a-restaurant-with-tables-and-chairs-outside-of-it-u9pc2Ss1fCU"
      //     : v,
      url: String,
      filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await reviews.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
