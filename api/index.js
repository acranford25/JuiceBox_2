const express = require("express");
const apiRouter = express.Router();

const jwt = require("jsonwebtoken");
const { getUserById, getUserByUsername } = require("../db");

apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");
  console.log("-----AUTH", auth);
  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    console.log("----TOKEN", token);
    try {
      console.log("-----JWT_SECRET", process.env.JWT_SECRET);
      console.log("-----TOKEN", token);
      const { id, username } = jwt.verify(token, process.env.JWT_SECRET);
      console.log("-----USERNAME", username);
      console.log("---------ID", id);
      if (username) {
        user = await getUserByUsername(username);
        req.user = await getUserById(user.id);
        next();
      }
      if (req.user) {
        console.log("User is set:", req.user);
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: `AuthorizationHeaderError`,
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);
const postsRouter = require("./posts");
apiRouter.use("/posts", postsRouter);
const tagsRouter = require("./tags");
apiRouter.use("/tags", tagsRouter);

apiRouter.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message,
  });
});

module.exports = apiRouter;
