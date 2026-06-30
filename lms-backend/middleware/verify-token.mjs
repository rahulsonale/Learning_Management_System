import { validateToken } from "../services/jwt-service.mjs";

export default async function verfiyToken(req, res, next) {
  console.log("Cookies:", req.cookies);
  console.log("Headers cookie:", req.headers.cookie);

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "No token found" });
  }

  try {
    const result = await validateToken(token);

    if (result) {
      req.user = { ...result, token };
      next();
    } else {
      return res.status(401).send({ message: "Invalid token" });
    }
  } catch (ex) {
    console.error("Token validation error:", ex);
    return res.status(401).send({ message: "Invalid token", ex });
  }
}
