import { authenticateUser, createUser } from "../services/auth-service.mjs";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.SECURE === "true", // true in case of https,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: process.env.SECURE === "true" ? "none" : "lax",
};

export async function registerUser(req, res) {
  const { error, user } = await createUser(req.body);
  if (error) {
    res.status(500).json(error);
  } else {
    res.json({ message: "User saved" });
  }
}

export async function login(req, res) {
  const { error, user, token } = await authenticateUser(req.body);
  if (token) {
    console.log("COOKIE_OPTIONS:", COOKIE_OPTIONS);
    res.cookie("token", token, COOKIE_OPTIONS);
    res.send(user);
  } else {
    res.status(401).send({ message: error ?? "Unauthorized user!" });
  }
}

export async function logout(req, res) {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.json({ message: "Logged out" });
}

export async function me(req, res) {
  const { email, firstName, lastName, id, role } = req.user;
  res.json({ email, firstName, lastName, id, role });
}
