import express from "express";
import path from "path";

const router = express.Router();

router.get("^/$|index(.html)?", (req, res) => {
  console.log(path.join(path.resolve()));
  res.sendFile(path.join(path.resolve(), "views", "subdir", "index.html"));
});

router.get("/test(.html)?", (req, res) => {
  res.sendFile(path.join(path.resolve(), "views", "subdir", "test.html"));
});

export default router;
