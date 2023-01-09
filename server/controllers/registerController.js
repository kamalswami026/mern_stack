import User from "../model/User.js";
import bcrypt from "bcrypt";

export const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and Password are required" });

  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.sendStatus(409);

  try {
    const hasedPassword = await bcrypt.hash(pwd, 10);
    const result = await User.create({
      username: user,
      password: hasedPassword,
    });

    console.log(result);

    res.status(201).json({ success: `New user created ${user}!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
