require("dotenv").config();

const bcrypt = require("bcryptjs");

const prisma = require("../prisma.ts");

const jwt = require("jsonwebtoken");

async function loginUser(req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;

    console.log(username);
    console.log(password);
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
      include: {
        password: true,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password.hash))) {
      return res.status(401).json({ error: "Incorrect login credentials." });
    }

    jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) {
          return res.status(500).json({ error: "Token generation failed. " });
        }
        const { password: _, ...userWithoutPassword } = user;
        return res.json({ token, user: userWithoutPassword });
      }
    );
  } catch (error) {
    console.error("Login error: " + error);
    return res.status(500).json({ error: "Internal server error. " });
  }
}

async function createUser(req, res) {
  const { username, password, email, firstname, lastname, isAuthor } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: {
          create: {
            hash: hashedPassword,
          },
        },
        email,
        firstname,
        lastname,
        isAuthor: isAuthor === "true" ? true : false,
      },
    });
    return res.json(user);
  } catch (error) {
    console.error(error);
  }
}

async function viewUser(req, res) {
  jwt.verify(req.token, "johnson", async (error, authData) => {
    if (error) {
      console.error(
        "the following error was received when verifying the bearer token: " +
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
            error: "Cannot view another users account.",
          });
        }

        const user = await prisma.user.findFirst({
          where: {
            id: tokenUserId,
          },
        });

        return res.json(user);
      } catch (error) {
        console.error(
          "The following error was received when accessing the user: " + error
        );
      }
    }
  });
}

async function updateUser(req, res) {
  jwt.verify(req.token, "johnson", async (error, authData) => {
    if (error) {
      console.error(
        "the following error was received when verifying the bearer token: " +
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

        const { username, email, firstname, lastname } = req.body;

        if (urlUserId !== tokenUserId) {
          return res.status(403).json({
            error: "Cannot update another users account.",
          });
        }

        const newHashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await prisma.user.update({
          where: {
            id: tokenUserId,
          },
          data: {
            username,
            email,
            firstname,
            lastname,
            password: {
              update: {
                data: {
                  hash: newHashedPassword,
                },
              },
            },
          },
        });

        return res.json(user);
      } catch (error) {
        console.error(
          "The following error was received when accessing the posts: " + error
        );
      }
    }
  });
}

async function deleteUser(req, res) {
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
            error: "Cannot delete another users account.",
          });
        }

        const deletedUser = await prisma.user.delete({
          where: {
            id: tokenUserId,
          },
        });
        return res.json({
          message: "User has been deleted.",
          clearToken: true,
        });
      } catch (error) {
        console.error(
          "The following error was received when deleting the user: " + error
        );
      }
    }
  });
}

///

module.exports = {
  loginUser,
  createUser,
  viewUser,
  updateUser,
  deleteUser,
};
