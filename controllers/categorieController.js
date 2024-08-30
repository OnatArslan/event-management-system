const { Categorie, Event, User } = require(`../models/index`);
const { Sequelize, Op } = require(`sequelize`);
exports.getAllCategories = async (req, res, next) => {
  try {
    const { count, rows } = await Categorie.findAndCountAll({
      attributes: {
        exclude: [`deletedAt`, `createdAt`, `updatedAt`],
      },
    });
    if (count === 0) {
      return next(new Error(`Can not find any categorie`));
    }
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
    const { name, description } = req.body;
    const categorie = await Categorie.create({
      name,
      description,
    });
    if (!categorie) {
      return next(new Error(`Creatin failed please try again!`));
    }
    res.status(200).json({
      status: `success`,
      message: `Categorie : "${categorie.name}" created successfully`,
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
        attributes: [`title`, `description`, `location`],
        include: {
          model: User,
          as: `organizer`,
          attributes: [`username`, `email`],
        },
      },
      attributes: [`id`, `name`, `description`],
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
    const { name, description } = req.body;
    await Categorie.update(
      { name: name, description: description },
      {
        where: {
          id: req.params.categorieId,
        },
        validate: true,
      }
    );
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
      // This will use paranoid property(soft delete)
      force: false,
    });
    res.status(200).json({
      status: `success`,
      message: `Categorie and events deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
