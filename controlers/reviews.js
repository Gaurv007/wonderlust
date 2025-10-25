const Listing = require("../models/listing");
const Review = require("../models/review.js")

module.exports.createreview = async (req, res) => {
    
  const listing = await Listing.findById(req.params.id); // now req.params.id will exist
  const newreview = new Review(req.body.review);
  newreview.author = req.user._id
  console.log(newreview);
  listing.reviews.push(newreview);

  await newreview.save();
  await listing.save();
  req.flash("success","new review review")
  res.redirect(`/listings/${listing._id}`);
}


module.exports.destroyreview = async (req, res) => {
  const { id, reviewid } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  await Review.findByIdAndDelete(reviewid);
  req.flash("success","review deleted")

  res.redirect(`/listings/${id}`);
}