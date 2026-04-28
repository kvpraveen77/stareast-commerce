const productModel = require("../models/productModel");

function checkout(user, { paymentMethod, items }) {
  if (!paymentMethod || !Array.isArray(items) || items.length === 0) {
    throw new Error("paymentMethod and items are required");
  }

  if (!["cash", "credit_card"].includes(paymentMethod)) {
    throw new Error("paymentMethod must be cash or credit_card");
  }

  const detailedItems = items.map((item) => {
    const product = productModel.findById(Number(item.productId));
    const quantity = Number(item.quantity);

    if (!product) {
      throw new Error(`product ${item.productId} not found`);
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(`invalid quantity for product ${item.productId}`);
    }

    return {
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity,
      total: product.price * quantity,
    };
  });

  const subtotal = detailedItems.reduce((sum, item) => sum + item.total, 0);
  const discount = paymentMethod === "cash" ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  return {
    message: "checkout completed",
    customer: { id: user.id, email: user.email, name: user.name },
    paymentMethod,
    items: detailedItems,
    subtotal,
    discount,
    total,
  };
}

module.exports = {
  checkout,
};
