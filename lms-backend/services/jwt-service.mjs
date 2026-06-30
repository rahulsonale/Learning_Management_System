import jwt from "jsonwebtoken";
export function generateToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_KEY,
      { expiresIn: process.env.TOKEN_VALIDITY },
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      },
    );
  });
}

export default async function verfiyToken(req, res, next) {
  console.log("Cookies:", req.cookies);

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "No token found" });
  }
}

export function validateToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_KEY, (error, userInfo) => {
      if (error) {
        reject(error);
      } else {
        resolve(userInfo);
      }
    });
  });
}
