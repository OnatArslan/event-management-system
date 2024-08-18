const express = require("express");

const categorieController = require(`../controllers/categorieController`);

const router = express.Router({ mergeParams: true });

router
  .route(`/`)
  .get(categorieController.getAllCategories)
  .post(categorieController.createCategorie);

router
  .route(`/:categorieId`)
  .get(categorieController.getCategorieAndEvents)
  .delete(categorieController.deleteCategorie)
  .patch(categorieController.updateCategorie);

module.exports = router;
