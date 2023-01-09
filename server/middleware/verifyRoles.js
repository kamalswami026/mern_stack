export const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.body) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    console.log(rolesArray);
    console.log(req.roles);
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((role) => role === true);

    if (!result) return res.sendStatus(401); //unauthorized

    next();
  };
};
