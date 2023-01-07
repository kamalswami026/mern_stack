import { createRequire } from "module";
// import usersList from "../model/users.json" assert { type: "json" };
import path from "path";
import { promises as fsPromises } from "fs";
import bcrypt from "bcrypt";


const require = createRequire(import.meta.url);
const usersList = require("../model/users.json");

const userDB = {
  users: usersList,
  setUsers: function (data) {
    this.users = data;
  },
};

export const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and Password are required" });

  const duplicate = userDB.users.find((person) => person.username === user);
  if (duplicate) return res.sendStatus(409);

  try {
    const hasedPassword = await bcrypt.hash(pwd, 10);
    const newUser = { username: user, password: hasedPassword };
    userDB.setUsers([...userDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(path.resolve(), "model", "users.json"),
      JSON.stringify(userDB.users)
    );
    console.log(userDB.users);
    res.status(201).json({ success: `New user created ${user}!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
