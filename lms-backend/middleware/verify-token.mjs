import { validateToken } from "../services/jwt-service.mjs";
export default async function verfiyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send({ message: "No token found" });
  } else {
    console.log("validating token");
    try {
      const result = await validateToken(token);
      console.log(result);
      if (result) {
        req.user = { ...result, token };
        next();
      } else {
        res.status(401).send({ message: "Invalid token" });
      }
    } catch (ex) {
      res.status(401).send({ ex });
    }
  }
}
