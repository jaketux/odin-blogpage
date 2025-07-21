const prisma = require("../prisma.ts");

const { Router } = require("express");

const usersController = require("../controller/usersController.js");

const usersRouter = Router();

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

usersRouter.post("/", usersController.createUser);
usersRouter.post("/login", usersController.loginUser);
usersRouter.get("/:userid", verifyToken, usersController.viewUser);
usersRouter.put("/:userid", verifyToken, usersController.updateUser);
usersRouter.delete("/:userid", verifyToken, usersController.deleteUser);

module.exports = usersRouter;
