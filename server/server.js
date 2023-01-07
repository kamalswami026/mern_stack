import express from "express";
import path from "path";
import cors from "cors";
import { logger } from "./middleware/logEvents.js";
import { errorHandler } from "./middleware/errorHandler.js";
import subdir from "./routes/subdir.js";
import root from "./routes/root.js";
import employees from "./routes/api/employees.js";

const PORT = process.env.PORT || 3500;

const app = express();

//custom middleware
app.use(logger);

//cors origin
const whiteList = [
  "http://www.yoursite.com",
  "http://127.0.0.1:5500",
  "http://localhost:3500",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      //TODO: Only for developement - !origin
      callback(null, true);
    } else {
      callback(new Error("Not allowed by cors"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(path.resolve(), "/public")));
app.use("/subdir", express.static(path.join(path.resolve(), "/public")));

app.use("/subdir", subdir);
app.use("/", root);
app.use("/employees", employees);

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
