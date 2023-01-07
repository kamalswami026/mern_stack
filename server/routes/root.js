import express from "express";
import path from "path";

const router = express.Router();

router.get("^/$|index(.html)?", (req, res) => {
  res.sendFile(path.join(path.resolve(), "views", "index.html"));
});

router.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(path.resolve(), "views", "new-page.html"));
});

router.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page");
});

export default router;
