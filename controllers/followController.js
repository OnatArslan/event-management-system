exports.sendFollowRequest = async (req, res, next) => {
  try {
    res.status(200).json({
      status: `success`,
      message: `Follow request send to user`,
    });
  } catch (err) {
    next(err);
  }
};
