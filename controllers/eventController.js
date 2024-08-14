const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getAllEvents = async (req, res, next) => {
  try {
    await prisma.user.create({
      data: {
        name: "Alice",
        email: "onat@prisma.io",
        posts: {
          create: { title: "Hello World" },
        },
        profile: {
          create: { bio: "I like turtles" },
        },
      },
    });

    const allUsers = await prisma.user.findMany({
      include: {
        posts: true,
        profile: true,
      },
    });

    res.status(200).json({
      status: `success`,
      data: {
        allUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};
