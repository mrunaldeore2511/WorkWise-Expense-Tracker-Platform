const router = require("express").Router();

router.get("/ping", (req, res) => {
    res.json({ message: "Backend connected 🚀" });
});

module.exports = router;
