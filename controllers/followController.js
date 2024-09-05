const { where } = require('sequelize');
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
      joinTableAttributes: [],
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

exports.getFollowRequest = async (req, res, next) => {
  try {
    // Remember this code block ;)
    const followRequest = await req.user.getFollowers({
      attributes: [`username`, `email`],
      joinTableAttributes: [`id`, `status`],
      through: {
        where: { id: req.params.requestId },
      },
    });
    res.status(200).json({
      status: `success`,
      data: {
        followRequest,
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
      const follower = await User.findOne({
        where: {
          id: followRequest.followerId,
        },
      });
      if (!follower) {
        return next(new Error(`Can not find follower user`));
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

// This is for remove following
exports.removeFollowing = async (req, res, next) => {
  try {
    if (!req.params.followingId) {
      return next(new Error(`user ID do not found`));
    }
    const userFollower = await UserFollower.findOne({
      where: {
        followingId: req.params.followingId,
        followerId: req.user.id,
        status: `approved`,
      },
    });
    if (!userFollower) {
      return next(
        new Error(`Can not unfollow because you are not following this user`)
      );
    }
    const following = await User.findOne({
      where: { id: req.params.followingId },
    });
    await userFollower.destroy({ force: true });

    const followingCount = await req.user.countFollowings({
      through: {
        where: { status: `approved` },
      },
    });
    const followerCount = await following.countFollowers({
      through: {
        where: { status: `approved` },
      },
    });
    await req.user.update({
      followingCount: followingCount,
    });
    await following.update({
      followerCount: followerCount,
    });
    res.status(200).json({
      status: `success`,
      message: `User successfully removed from your followings`,
    });
  } catch (err) {
    next(err);
  }
};

// This is remove your follower
exports.removeFollower = async (req, res, next) => {
  try {
    if (!req.params.followerId) {
      return next(new Error(`Can not find any follower`));
    }
    const friendShip = await UserFollower.findOne({
      where: {
        followingId: req.user.id,
        followerId: req.params.followerId,
        status: `approved`,
      },
    });
    if (!friendShip) {
      return next(new Error(`Can not find any follower with given ID`));
    }
    const follower = await User.findOne({
      where: { id: req.params.followerId },
    });
    if (!follower) {
      return next(new Error(`Can not find any user with given ID`));
    }
    try {
      await req.user.removeFollowers(follower);
      const followerCount = await req.user.countFollowers({
        through: {
          where: { status: `approved` },
        },
      });
      const followingCount = await follower.countFollowings({
        through: {
          where: { status: `approved` },
        },
      });
      await req.user.update({
        followerCount: followerCount,
      });
      await follower.update({
        followingCount: followingCount,
      });
      res.status(200).json({
        message: `User :${follower.username} removed successfully`,
      });
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};
