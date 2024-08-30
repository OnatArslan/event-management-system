const { Categorie, Event } = require(`../models/index`);

exports.getAllCategories = async (req, res, next) => {
  try {
    const { count, rows } = await Categorie.findAndCountAll({
      attributes: {
        exclude: [`deletedAt`, `createdAt`, `updatedAt`],
      },
    });

    req.session.visited = true;

    res.status(200).json({
      status: `success`,
      message: `Showing ${count} categories on this page`,
      data: {
        categories: rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createCategorie = async (req, res, next) => {
  try {
    const categorie = await Categorie.create(req.body);

    if (!categorie) {
      return next(new Error(`Creatin failed please try again!`));
    }

    res.status(200).json({
      status: `success`,
      data: {
        categorie: categorie,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategorieAndEvents = async (req, res, next) => {
  try {
    const categorie = await Categorie.findByPk(req.params.categorieId, {
      include: {
        model: Event,
        as: `categorizedEvents`,
      },
    });
    if (!categorie) {
      return next(new Error(`This categorie does not exist!`));
    }
    res.status(200).json({
      status: `success`,
      data: {
        categorie: categorie,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCategorie = async (req, res, next) => {
  try {
    await Categorie.update(req.body, {
      where: {
        id: req.params.categorieId,
      },
    });
    res.status(200).json({
      status: `success`,
      message: `Categorie updated successfully`,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategorie = async (req, res, next) => {
  try {
    await Categorie.destroy({
      where: {
        id: req.params.categorieId,
      },
      force: true,
    });
    res.status(200).json({
      status: `success`,
      message: `Categorie and events deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
