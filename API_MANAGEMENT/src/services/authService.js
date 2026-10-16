import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import {
  findUserByEmail,
  createUser,
} from "../repositories/userRepository.js";
import {
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
} from "../repositories/refreshTokenRepository.js";

export const registerUser = async ({
  name,
  email,
  password,
}) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const id = uuidv4();

  const user = await createUser({
    id,
    name,
    email,
    passwordHash,
    role: "DEVELOPER",
  });

  return user;
};

export const loginUser = async ({
  email,
  password,
}) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

 const accessToken = jwt.sign(
  {
    userId: user.id,
    email: user.email,
    role: user.role,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "15m",
  }
);

const refreshToken = jwt.sign(
  {
    userId: user.id,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

const refreshTokenId = uuidv4();

const expiresAt = new Date(
  Date.now() + 7 * 24 * 60 * 60 * 1000
);

await createRefreshToken({
  id: refreshTokenId,
  userId: user.id,
  token: refreshToken,
  expiresAt,
});

return {
  accessToken,
  refreshToken,
};
};

export const refreshAccessToken = async (
  refreshToken
) => {
  const storedToken =
    await findRefreshToken(refreshToken);

  if (!storedToken) {
    throw new Error("Refresh token not found");
  }

  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_SECRET
  );

  const accessToken = jwt.sign(
    {
      userId: decoded.userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );

  return {
    accessToken,
  };
};
export const logoutUser = async (
  refreshToken
) => {
  await deleteRefreshToken(refreshToken);

  return {
    message: "Logged out successfully",
  };
};

