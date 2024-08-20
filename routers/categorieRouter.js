const express = require("express");
const categorieController = require(`../controllers/categorieController`);

const authMiddleware = require(`../middlewares/authMiddleware`);

const router = express.Router({ mergeParams: true });

router
  .route(`/`)
  .get(
    authMiddleware.protect,
    authMiddleware.restrict([`admin`, `organizer`]),
    categorieController.getAllCategories
  )
  .post(categorieController.createCategorie);

router
  .route(`/:categorieId`)
  .get(categorieController.getCategorieAndEvents)
  .delete(categorieController.deleteCategorie)
  .patch(categorieController.updateCategorie);

module.exports = router;
