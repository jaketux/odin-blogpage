const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());

const passport = require("passport");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const usersRouter = require("./routes/users.js");
const postsRouter = require("./routes/posts.js");

const bcrypt = require("bcryptjs");

// var JwtStrategy = require("passport-jwt").Strategy,
//   ExtractJwt = require("passport-jwt").ExtractJwt;

// var opts = {};

// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

// opts.secretOrKey = "johnson";

// passport.use(
//   new JwtStrategy(opts, async function (jwt_payload, done) {
//     try {
//       const user = await prisma.user.findFirst({
//         where: {
//           id: jwt_payload.sub,
//         },
//       });

//       if (user) {
//         return done(null, user);
//       } else {
//         return done(null, false, { message: "Could not find user" });
//       }
//     } catch (error) {
//       return done(error, false);
//     }
//   })
// );

app.use("/users", usersRouter);
app.use("/posts", postsRouter);

app.listen(5000, () => {
  console.log(`App listening on 5000`);
});
