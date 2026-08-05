import User from "../models/User.js";
import Driver from "../models/Driver.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";

/**
 * Format large numbers nicely
 */
const formatCount = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
  return `${num}+`;
};

/**
 * GET /api/public/landing
 */
export const getLandingData = async (req, res) => {
  try {
    // =============================
    // Statistics
    // =============================

    const totalUsers = await User.countDocuments();

    const totalDrivers = await Driver.countDocuments();

    const completedTrips = await Booking.countDocuments({
      status: "completed",
    });

    // =============================
    // Average Rating
    // =============================

    const ratingResult = await Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: {
            $avg: "$rating",
          },
        },
      },
    ]);

    const averageRating =
      ratingResult.length > 0
        ? Number(
            ratingResult[0].averageRating.toFixed(1)
          )
        : 5;

    // =============================
    // Latest Testimonials
    // =============================

    const reviews = await Review.find()
      .populate("userId", "name")
      .populate("driverId", "name")
      .sort({
        createdAt: -1,
      })
      .limit(3);

    const testimonials = reviews.map((review) => ({
      _id: review._id,

      rating: review.rating,

      review:
        review.feedback && review.feedback.trim() !== ""
          ? review.feedback
          : "Great ride experience.",

      user: {
        fullname:
          review.userId?.name || "Anonymous",
      },

      driver: {
        fullname:
          review.driverId?.name || "Driver",
      },

      createdAt: review.createdAt,
    }));

    // =============================
    // Response
    // =============================

    return res.status(200).json({
      success: true,

      stats: {
        users: formatCount(totalUsers),
        drivers: formatCount(totalDrivers),
        trips: formatCount(completedTrips),
        rating: averageRating,
      },

      communityMembers: formatCount(
        totalUsers + totalDrivers
      ),

      testimonials,
    });
  } catch (error) {
    console.error(
      "LANDING DATA ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch landing page data.",
    });
  }
};