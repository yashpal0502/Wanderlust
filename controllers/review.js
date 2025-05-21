const listing = require("../models/listing");
const Review = require("../models/reviews.js");

module.exports.createReview = async (req, res) => {
  let list_ID = await listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  newReview.author = req.user._id;

  list_ID.reviews.push(newReview);
  await newReview.save();
  await list_ID.save();

  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${list_ID._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findById(reviewId);

  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
