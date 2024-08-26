const { where } = require("sequelize");
const { User, UserFollower } = require(`../models/index`);

exports.getFollowings = async (req, res, next) => {
  try {
    // Remember this code block ;)
    const followings = await req.user.getFollowings({
      attributes: [`username`, `email`],
      joinTableAttributes: [`status`],
      through: {
        where: { status: `approved` },
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

exports.getFollowers = async (req, res, next) => {
  try {
    // Remember this code block ;)
    const followers = await req.user.getFollowers({
      attributes: [`username`, `email`],
      joinTableAttributes: [`status`],
      through: {
        where: { status: `approved` },
      },
    });
    res.status(200).json({
      status: `success`,
      data: {
        followers,
      },
    });
  } catch (err) {
    next(err);
  }
};

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

exports.getFollowRequests = async (req, res, next) => {
  try {
    // Remember this code block ;)
    const followRequests = await req.user.getFollowers({
      attributes: [`username`, `email`],
      joinTableAttributes: [`status`, `id`],
      through: {
        where: { status: `pending` },
      },
    });
    res.status(200).json({
      status: `success`,
      data: {
        followRequests,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.responseFollowRequest = async (req, res, next) => {
  try {
    const response = req.body.response;
    if (!(response === `accept` || response === `decline`)) {
      return next(new Error(`Response must be either decline or accept`));
    }
    let followRequest;
    if (response === `accept`) {
      followRequest = await UserFollower.findOne({
        where: {
          id: req.params.requestId,
          followingId: req.user.id,
        },
      });
      if (!followRequest || followRequest.status === `approved`) {
        return next(
          new Error(`Can not find any follow request or already approved!`)
        );
      }
      await followRequest.update({
        status: `approved`,
      });
    } else {
      followRequest = await UserFollower.findOne({
        where: {
          id: req.params.requestId,
          followingId: req.user.id,
        },
      });
      if (!followRequest) {
        return next(new Error(`Can not find any follow request!`));
      }
      await followRequest.update({
        status: `rejected`,
      });
    }
    res.status(200).json({
      status: `success`,
      message: `${response} done successfully...`,
    });
  } catch (err) {
    next(err);
  }
};

exports.unfollow = async (req, res, next) => {
  try {
    res.status(200).json({
      status: `success`,
      message: `User removed from your followers successfully`,
    });
  } catch (err) {
    next(err);
  }
};
