import jwt from 'jsonwebtoken';

export const generate = (userId, res) => {
  console.log(process.env.JWT_SECRET)
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15d',
  });
  res.clearCookie('jwt');  

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
  console.log(token)
  return token;
};

export default generate;
