const express = require("express");
const categorieController = require(`../controllers/categorieController`);

const authMiddleware = require(`../middlewares/authMiddleware`);

const router = express.Router({ mergeParams: true });

router.route(`/`).get(categorieController.getAllCategories);

// Protect below routes
router.use(authMiddleware.protect, authMiddleware.restrict(`admin`));
router.route(`/`).post(categorieController.createCategorie);

router
  .route(`/:categorieId`)
  .get(categorieController.getCategorieAndEvents)
  .delete(categorieController.deleteCategorie)
  .patch(categorieController.updateCategorie);

module.exports = router;
