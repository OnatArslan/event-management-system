const express = require("express");

const categorieController = require(`../controllers/categorieController`);

const router = express.Router({ mergeParams: true });

router.route(`/`).get(categorieController.getAllCategories);

module.exports = router;
