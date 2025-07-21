require("dotenv").config();

const bcrypt = require("bcryptjs");

const prisma = require("../prisma.ts");

const jwt = require("jsonwebtoken");

async function createPost(req, res) {
  jwt.verify(req.token, "johnson", async (error, authData) => {
    if (error) {
      console.error(
        "The following error was received when verifying the bearer token: " +
          error
      );
      res.sendStatus(403);
    } else {
      try {
        const { title, tagline, content, published } = req.body;

        const tokenUserId = authData.sub;

        const user = await prisma.user.findFirst({
          where: {
            id: tokenUserId,
          },
          include: {
            password: true,
          },
        });

        console.log(user);

        if (!user.isAuthor) {
          return res.status(403).json({
            error: "You must be an author to create posts",
          });
        } else {
          const newPost = await prisma.post.create({
            data: {
              title,
              tagline,
              content,
              published,
              userId: tokenUserId,
            },
          });
          return res.json(newPost);
        }
      } catch (error) {
        console.error(
          "The following error was received when creating the post: " + error
        );
      }
    }
  });
}

async function viewAllPosts(req, res) {
  jwt.verify(req.token, "johnson", async (error, authData) => {
    if (error) {
      console.error(
        "The following error was received when verifying the bearer token: " +
          error
      );
      res.sendStatus(403);
    } else {
      try {
        const userId = authData.sub;
        const user = await prisma.user.findFirst({
          where: {
            id: userId,
          },
        });

        if (!user.isAuthor) {
          const posts = await prisma.post.findMany({
            where: {
              published: true,
            },
            include: {
              comments: {
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      firstname: true,
                      lastname: true,
                    },
                  },
                },
              },
              user: {
                select: {
                  id: true,
                  username: true,
                  firstname: true,
                  lastname: true,
                },
              },
            },
          });
          console.log(posts);
          return res.json(posts);
        } else {
          const posts = await prisma.post.findMany({
            include: {
              comments: {
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      firstname: true,
                      lastname: true,
                    },
                  },
                },
              },
              user: {
                select: {
                  id: true,
                  username: true,
                  firstname: true,
                  lastname: true,
                },
              },
            },
          });
          return res.json(posts);
        }
      } catch (error) {
        console.error(
          "The following error was received when accessing the posts: " + error
        );
      }
    }
  });
}

async function viewPost(req, res) {
  // if not logged in, get all published posts.
  // if logged in but not author, get all published posts
  // if logged in and author, get all posts + unpublished posts, or create separate route for unpublished posts
  jwt.verify(req.token, "johnson", async (error, authData) => {
    if (error) {
      console.error(
        "The following error was received when verifying the bearer token: " +
          error
      );
      return res.status(403).json({ message: "Error verifying JWT token." });
    } else {
      try {
        const userId = authData.sub;
        const user = await prisma.user.findFirst({
          where: {
            id: userId,
          },
        });

        const postId = parseInt(req.params.postid);

        if (!user.isAuthor) {
          const post = await prisma.post.findFirst({
            where: {
              published: true,
              id: postId,
            },
            include: {
              comments: {
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      firstname: true,
                      lastname: true,
                    },
                  },
                },
              },
              user: {
                select: {
                  id: true,
                  username: true,
                  firstname: true,
                  lastname: true,
                },
              },
            },
          });
          return res.json(post);
        } else {
          const post = await prisma.post.findFirst({
            where: {
              id: postId,
            },
            include: {
              comments: {
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      firstname: true,
                      lastname: true,
                    },
                  },
                },
              },
              user: {
                select: {
                  id: true,
                  username: true,
                  firstname: true,
                  lastname: true,
                },
              },
            },
          });
          return res.json(post);
        }
      } catch (error) {
        console.error(
          "The following error was received when accessing the posts: " + error
        );
      }
    }
  });
}

async function updatePost(req, res) {
  jwt.verify(req.token, "johnson", async (error, authData) => {
    if (error) {
      console.error(
        "the following error was received when verifying the bearer token: " +
          error
      );
      res.sendStatus(403);
    } else {
      try {
        const postId = parseInt(req.params.postid);
        const { title, tagline, content, published } = req.body;

        const updatedPost = await prisma.post.update({
          where: {
            id: postId,
            userId: authData.sub,
          },
          data: {
            title: title,
            tagline: tagline,
            content: content,
            published: published,
          },
        });

        return res.json("This post has been updated. ");
      } catch (error) {
        console.error(
          "The following error was received when updating the post: " + error
        );
      }
    }
  });
}

async function togglePublished(req, res) {
  jwt.verify(req.token, "johnson", async (error, authData) => {
    if (error) {
      console.error(
        "the following error was received when verifying the bearer token: " +
          error
      );
      res.sendStatus(403);
    } else {
      try {
        const postId = parseInt(req.params.postid);

        const currentPost = await prisma.post.findUnique({
          where: {
            id: postId,
          },
          select: {
            published: true,
          },
        });

        const updatedPost = await prisma.post.update({
          where: {
            id: postId,
            userId: authData.sub,
          },

          data: {
            published: !currentPost.published,
          },
        });

        return res.json("Published status has been toggled.");
      } catch (error) {
        console.error(
          "The following error was received when updating the post: " + error
        );
      }
    }
  });
}

async function deletePost(req, res) {
  jwt.verify(req.token, "johnson", async (error, authData) => {
    if (error) {
      console.error(
        "The following error was received when verifying the bearer token: " +
          error
      );
      res.sendStatus(403);
    } else {
      try {
        const tokenUserId = authData.sub;

        const postId = parseInt(req.params.postid);

        const postToDelete = await prisma.post.findUnique({
          where: {
            id: postId,
          },
          include: {
            user: true,
          },
        });

        if (postToDelete.user.id !== tokenUserId) {
          return res.status(403).json({
            error: "Cannot delete another user's post.",
          });
        }

        if (!postToDelete.user.isAuthor) {
          return res.status(403).json({
            error: "Cannot delete posts without author privileges.",
          });
        }

        console.log({ ...postToDelete });

        const deletedPost = await prisma.post.delete({
          where: {
            userId: tokenUserId,
            id: postId,
          },
        });
        return res.json({ message: "Message has been deleted." });
      } catch (error) {
        console.error(
          "The following error was received when deleting the user: " + error
        );
      }
    }
  });
}

async function createComment(req, res) {
  jwt.verify(req.token, "johnson", async (error, authData) => {
    if (error) {
      console.error(
        "The following error was received when verifying the bearer token: " +
          error
      );
      res.sendStatus(403);
    } else {
      try {
        const { content } = req.body;

        const tokenUserId = authData.sub;

        const postId = parseInt(req.params.postid);

        const allUsers = await prisma.user.findMany({
          select: { id: true, username: true },
        });

        console.log("All users:", allUsers);

        console.log("Payload user: ", authData.sub);

        const object = { ...req.params };

        const user = await prisma.user.findFirst({
          where: {
            id: tokenUserId,
          },
        });

        const newComment = await prisma.comment.create({
          data: {
            content,
            postId: postId,
            userId: tokenUserId,
          },
        });

        return res.json("Comment has been posted!");
      } catch (error) {
        console.error(
          "The following error was received when creating the post: " + error
        );
      }
    }
  });
}

async function updateComment(req, res) {
  jwt.verify(req.token, "johnson", async (error, authData) => {
    if (error) {
      console.error(
        "the following error was received when verifying the bearer token: " +
          error
      );
      res.sendStatus(403);
    } else {
      try {
        const postId = parseInt(req.params.postid);

        const commentId = parseInt(req.params.commentid);

        const { content } = req.body;

        console.log(postId);
        console.log(commentId);

        console.log(content);

        const user = await prisma.user.findUnique({
          where: { id: authData.sub },
        });

        const whereClause = (await user.isAuthor)
          ? { postId, id: commentId }
          : { userId: authData.sub, postId, id: commentId };

        const existingComment = await prisma.comment.findFirst({
          where: whereClause,
        });

        if (!existingComment) {
          return res.status(404).json({
            message:
              "Either that comment does not exist or you do not have authority to edit that comment. ",
          });
        }

        const updatedComment = await prisma.comment.update({
          where: {
            id: existingComment.id,
          },
          data: {
            content,
            updatedAt: new Date(),
          },
        });
        return res.json("Comment has been updated. ");
      } catch (error) {
        console.error(
          "The following error was received when updating the comment: " + error
        );
      }
    }
  });
}

async function deleteComment(req, res) {
  jwt.verify(req.token, "johnson", async (error, authData) => {
    if (error) {
      console.error(
        "The following error was received when verifying the bearer token: " +
          error
      );
      res.sendStatus(403);
    } else {
      try {
        // this will actually be the userId as stored in the post and passed into req.params
        const urlUserId = authData.sub;
        //
        const tokenUserId = authData.sub;
        console.log(tokenUserId);

        if (urlUserId !== tokenUserId) {
          return res.status(403).json({
            error: "Cannot delete another users post.",
          });
        }

        const commentId = parseInt(req.params.commentid);

        const postId = parseInt(req.params.postid);

        const user = await prisma.user.findUnique({
          where: { id: authData.sub },
        });

        const whereClause = user.isAuthor
          ? { postId, id: commentId }
          : { userId: authData.sub, postId, id: commentId };

        const existingComment = await prisma.comment.findFirst({
          where: whereClause,
        });

        if (!existingComment) {
          return res.status(404).json({
            message:
              "Either that comment does not exist or you do not have authority to edit that comment. ",
          });
        }

        const deletedComment = await prisma.comment.delete({
          where: {
            id: existingComment.id,
          },
        });

        return res.json({ message: "Comment has been deleted." });
      } catch (error) {
        console.error(
          "The following error was received when deleting the user: " + error
        );
      }
    }
  });
}

module.exports = {
  createPost,
  viewAllPosts,
  viewPost,
  updatePost,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
  togglePublished,
};
