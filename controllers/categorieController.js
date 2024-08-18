const { Categorie, Event } = require(`../models/index`);

exports.getAllCategories = async (req, res, next) => {
  try {
    const { count, rows } = await Categorie.findAndCountAll();

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
        as: `events`,
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
