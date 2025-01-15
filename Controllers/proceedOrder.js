import orderDetails from "../Models/Services/orderDetails.js";

export default async function proceedOrder(req, res) {
  const orderRequest = req.body;

  if (!Array.isArray(orderRequest)) {
    return res
      .status(400)
      .json({
        error: "Invalid request format. Expected an array of products.",
      });
  }

  try {
    const requestedOrderDetails = await orderDetails(orderRequest);

    if (requestedOrderDetails.error) {
      return res.status(400).json({ error: requestedOrderDetails.error });
    }

    const orderTotal = requestedOrderDetails.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    res.json({
      message: "Order processed successfully",
      orderDetails: requestedOrderDetails,
      totalPrice: orderTotal,
    });
  } catch (error) {
    console.error("Order processing error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the order." });
  }
}
