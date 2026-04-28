const bcrypt = require("bcryptjs");

const users = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    password: bcrypt.hashSync("password123", 8),
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@example.com",
    password: bcrypt.hashSync("password123", 8),
  },
  {
    id: 3,
    name: "Carol",
    email: "carol@example.com",
    password: bcrypt.hashSync("password123", 8),
  },
];

function findByEmail(email) {
  return users.find((user) => user.email === email);
}

function createUser({ name, email, password }) {
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
  };

  users.push(newUser);
  return newUser;
}

module.exports = {
  users,
  findByEmail,
  createUser,
};
