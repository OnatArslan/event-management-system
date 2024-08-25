const { User, UserFollower } = require(`../models/index`);

exports.sendFollowRequest = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    const curUser = req.user;
    if (!user) {
      return next(new Error(`Can not find any user with given ID`));
    }
    const isAlreadyFriends = await curUser.hasFollower(user);
    console.log(isAlreadyFriends);
    if (isAlreadyFriends) {
      return next(
        new Error(
          `You are already follow this user or you have a pending request to this user!!`
        )
      );
    }
    const followRequest = await UserFollower.create({
      followerId: curUser.id,
      followingId: user.id,
      status: `pending`,
    });
    res.status(200).json({
      status: `success`,
      message: `Follow request send to user:${user.username}`,
    });
  } catch (err) {
    next(err);
  }
};

exports.getFollowers = async (req, res, next) => {
  try {
    res.status(200).json({
      status: `success`,
      message: `Follow request send to user:${user.username}`,
    });
  } catch (err) {
    next(err);
  }
};
