import User from "../models/users.mjs";
import { hash, compare } from "bcrypt";
const SALT_ROUNDS = 10;
import { generateToken } from "./jwt-service.mjs";
import chalk from "chalk";
export async function createUser(user) {
  try {
    await User.init(); // ensure index is built - duplicate emails will not be allowed
    const newUser = await User.create({
      ...user,
      password: await hashPassword(user.password),
    });
    return { error: null, user: newUser };
  } catch (ex) {
    if (ex.code === 11000) {
      return { error: "Email already exists" };
    }

    return { error: ex.message };
  }
}

function hashPassword(password) {
  if (password) {
    return hash(password, SALT_ROUNDS);
  } else {
    throw new Error("Password not found");
  }
}

export async function authenticateUser(credentials) {
  const { email, password } = credentials;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return { error: "Invalid username or password!" };
  }

  const validUser = await compare(password, existingUser.password);
  if (validUser) {
    try {
      const { firstName, lastName, role, _id: id } = existingUser;
      const token = await generateToken({
        email,
        firstName,
        lastName,
        id,
        role,
      });
      return { user: { email, role, id, firstName, lastName }, token };
    } catch (ex) {
      console.error(chalk.redBright(ex));
      return { error: "Error while generating token" };
    }
  } else {
    return { error: "Invalid username or password!" };
  }
}

// export async function logout(req, res) {
//     await logoutUser(req.user.username, { token: null });
//     res.send({ message: "User logged out successfully!" })
// }
