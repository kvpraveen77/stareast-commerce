const products = [
  { id: 1, name: "Laptop", price: 1200 },
  { id: 2, name: "Headphones", price: 150 },
  { id: 3, name: "Mouse", price: 50 },
];

function findById(id) {
  return products.find((product) => product.id === id);
}

module.exports = {
  products,
  findById,
};
