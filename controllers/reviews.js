const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createNewReview = async (req, res) => {
  let newListing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  newListing.reviews.push(newReview);

  await newReview.save();
  await newListing.save();
  req.flash("success", "New Review Created!");
  console.log("New Reviews added");
  res.redirect(`/${newListing.id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");

  res.redirect(`/${id}`);
};
