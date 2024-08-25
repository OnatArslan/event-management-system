const express = require(`express`);

const authMiddleware = require(`../middlewares/authMiddleware`);

const followController = require(`../controllers/followController`);

const router = express.Router();

router.use(authMiddleware.protect);

router.route(`/`);

module.exports = router;
