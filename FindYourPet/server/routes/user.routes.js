const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { authenticate } = require('../config/jwt.config');
router.post("/new", UserController.createUser);
router.post("/session", UserController.login);
router.post("/forgotPassword", UserController.forgotPassword);
router.patch("/resetPassword/:token", UserController.resetPassword);
router.delete("/session", authenticate, UserController.loggout);
router.get("/cookie", authenticate, UserController.cookie);
router.get("/", authenticate, UserController.findAllUsers);
router.get("/:id", authenticate, UserController.findUserById);
module.exports = router;