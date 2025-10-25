const Listing = require("./models/listing.js")
const Review = require("./models/review.js")

const expresserror = require("./utils/expresserror");


const { listingSchema } = require("./schema");
const { reviewSchema } = require("./schema.js");
const review = require("./models/review.js");


module.exports.isLoggedIn = (req,res,next)=>{
  // console.log(req.path,"..",req.originalUrl);    
  if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;

    req.flash("error","you must be logged in to create listing");
    return  res.redirect("/login")
  }
next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}


module.exports.isOwner = async(req,res,next)=>{
    const { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing.owner.equals(req.user._id)) { // ✅ fixed
    req.flash("error", "You are not the owner of this listing ");
    return res.redirect(`/listings/${id}`);
  }
next();
}


// Validation middleware
module.exports.validateListing = (req, res, next) => {
  // Ensure image is always an object
  if (!req.body.listing.image) req.body.listing.image = {};

  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new expresserror(404, msg);
  } else {
    next();
  }
};

// Validation middleware
module.exports.validatereview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new expresserror(404, errmsg);
  } else {
    next();
  }
};



module.exports.isreviewAuthor = async (req, res, next) => {
  const { id, reviewid } = req.params;  // keep lowercase to match your route
  const review = await Review.findById(reviewid);
  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author.equals(req.user._id)) {  // ✅ fixed
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
