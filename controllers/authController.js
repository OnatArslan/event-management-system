exports.login = async (req, res, next) => {
  try {
    console.log(req.session);

    res.status(200).json({
      data: `hello`,
    });
  } catch (error) {}
};
