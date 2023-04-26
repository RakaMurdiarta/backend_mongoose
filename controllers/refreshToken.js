const jwt = require("jsonwebtoken");

exports.handleRefreshToken = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) {
    const error = new Error("No Authenticated");
    error.statusCode = 403;
    throw error;
  }

  const refreshToken = cookies.refreshToken;

  let decodeToken;
  try {
    decodeToken = jwt.verify(refreshToken, "refreshtoken");
  } catch (error) {
    error.statusCode = 403;
    throw error;
  }

  if (!decodeToken) {
    const error = new Error("Not Authenticated");
    error.StatusCode = 403;
    throw error;
  }

  console.log(decodeToken);

  const token = jwt.sign(
    {
      email: decodeToken.email,
      userId: decodeToken.userId,
    },
    "fsfskfjfdfdfdf",
    {
      expiresIn: "1s",
    }
  );

  res.json({ token, userId: decodeToken.userId });
};
