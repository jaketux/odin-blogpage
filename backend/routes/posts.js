const prisma = require("../prisma.ts");

const { Router } = require("express");

const postsController = require("../controller/postsController.js");

const postsRouter = Router();

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

postsRouter.get("/", verifyToken, postsController.viewAllPosts);
postsRouter.post("/", verifyToken, postsController.createPost);
postsRouter.get("/:postid", verifyToken, postsController.viewPost);
postsRouter.put("/:postid", verifyToken, postsController.updatePost);
postsRouter.put(
  "/:postid/toggle",
  verifyToken,
  postsController.togglePublished
);

postsRouter.delete("/:postid", verifyToken, postsController.deletePost);

postsRouter.post(
  "/:postid/comments",
  verifyToken,
  postsController.createComment
);

postsRouter.put(
  "/:postid/comments/:commentid",
  verifyToken,
  postsController.updateComment
);

postsRouter.delete(
  "/:postid/comments/:commentid",
  verifyToken,
  postsController.deleteComment
);

module.exports = postsRouter;
