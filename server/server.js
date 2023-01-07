import express from "express";
import path from "path";
import cors from "cors";
import { logger } from "./middleware/logEvents.js";
import { errorHandler } from "./middleware/errorHandler.js";
import root from "./routes/root.js";
import employees from "./routes/api/employees.js";
import register from "./routes/register.js";
import auth from "./routes/auth.js";
import refresh from "./routes/refresh.js";
import logout from "./routes/logout.js";
import { corsOptions } from "./config/corsOptions.js";
import { verifyJWT } from "./middleware/verifyJWT.js";
import cookieParser from "cookie-parser";
import { credentials } from "./middleware/credentials.js";

const PORT = process.env.PORT || 3500;

const app = express();

//custom middleware
app.use(logger);

//cors origin
//fetch cookie credential requirement
app.use(credentials);
app.use(cors(corsOptions));

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(path.resolve(), "/public")));

//middleware for cookie-parser
app.use(cookieParser());

//routes
app.use("/", root);
app.use("/auth", auth);
app.use("/register", register);
app.use("/refresh", refresh);
app.use("/logout", logout);
app.use("/employees", verifyJWT, employees);

app.get("/*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(path.resolve(), "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
