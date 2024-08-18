const express = require("express");

const categorieController = require(`../controllers/categorieController`);

const router = express.Router({ mergeParams: true });

router
  .route(`/`)
  .get(categorieController.getAllCategories)
  .post(categorieController.createCategorie);

module.exports = router;
