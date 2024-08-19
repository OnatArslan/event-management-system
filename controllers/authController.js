exports.login = async (req, res, next) => {
  try {
    res.status(200).json({
      data: `hello`,
    });
  } catch (error) {}
};
