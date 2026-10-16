import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  
} from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser({
      name,
      email,
      password,
    });
    const { password_hash, ...safeUser } = user;
    res.status(201).json(safeUser);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser({
      email,
      password,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const result = await refreshAccessToken(
      refreshToken
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

export const logout = async (
  req,
  res
) => {
  try {
    const { refreshToken } = req.body;

    const result = await logoutUser(
      refreshToken
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};