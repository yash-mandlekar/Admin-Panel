const useToken = (user, statusCode, res) => {
  const access_token = user.generateToken();

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    maxAge: 2 * 60 * 60 * 1000,
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", access_token, cookieOptions).json({
    status: "success",
    token: access_token,
    user,
  });
};

module.exports = useToken;
