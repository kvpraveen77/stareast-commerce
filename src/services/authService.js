const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const tokenService = require("./tokenService");

async function register({ name, email, password }) {
  if (!name || !email || !password) {
    throw new Error("name, email and password are required");
  }

  const existingUser = userModel.findByEmail(email);
  if (existingUser) {
    throw new Error("email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 8);
  const user = userModel.createUser({ name, email, password: hashedPassword });

  return {
    message: "user registered successfully",
    user: { id: user.id, name: user.name, email: user.email },
  };
}

async function login({ email, password }) {
  if (!email || !password) {
    throw new Error("email and password are required");
  }

  const user = userModel.findByEmail(email);
  if (!user) {
    throw new Error("invalid credentials");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("invalid credentials");
  }

  const token = tokenService.generateToken(user);
  return { token };
}

module.exports = {
  register,
  login,
};
