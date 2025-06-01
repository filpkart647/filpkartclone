const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersControllers");
const authMiddleware = require("../middleware/auth")


router.get("/users",  authMiddleware.auth, authMiddleware.isAdmin, userController.getAllUsers);
router.post("/users",authMiddleware.auth, authMiddleware.isAdmin, userController.addUser)



module.exports = router;
