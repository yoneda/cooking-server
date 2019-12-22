const jwt = require("jsonwebtoken");

const genToken = (account, password) => {
  const secret = process.env.SECRET;
  const token = jwt.sign({ user: { account, password } }, secret, {
    expiresIn: "3m"
  });
  return token;
};

module.exports = genToken;
