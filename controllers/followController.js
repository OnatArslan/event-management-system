const { where } = require("sequelize");
const { User, UserFollower } = require(`../models/index`);

exports.sendFollowRequest = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    const curUser = req.user;
    if (!user) {
      return next(new Error(`Can not find any user with given ID`));
    }
    if (user.id === curUser.id) {
      return next(new Error(`Can not follow yourself`));
    }
    const isAlreadyFriends = await curUser.hasFollowing(user);
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

exports.getFollowings = async (req, res, next) => {
  try {
    // Remember this code block ;)
    const followings = await req.user.getFollowings({
      attributes: [`username`, `email`],
      joinTableAttributes: [`status`],
      through: {
        where: { status: `pending` },
      },
    });
    res.status(200).json({
      status: `success`,
      data: {
        followings,
      },
    });
  } catch (err) {
    next(err);
  }
};
