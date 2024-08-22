const express = require("express");

const router = express.Router({ mergeParams: true });

router.route(`/`).get();

module.exports = router;
