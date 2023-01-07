import { createRequire } from "module";
import bcrypt from "bcrypt";

const require = createRequire(import.meta.url);
const usersList = require("../model/users.json");

const userDB = {
  users: usersList,
  setUsers: function (data) {
    this.users = data;
  },
};

export const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  console.log("🚀 ~ file: authController.js:16 ~ handleLogin ~ user", user)

  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and Password are required" });

  const foundUser = userDB.users.find((person) => person.username === user);
  if (!foundUser) return res.sendStatus(401);

  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    res.json({ success: `User ${user} logged in!` });
  } else {
    res.sendStatus(401);
  }
};
