import orderDetails from '../Models/Services/orderDetails.js';

export default async function proceedOrder(req, res) {
    const orderRequest = req.body;

    if (!Array.isArray(orderRequest)) {
        return res.status(400).json({ error: "Invalid request format. Expected an array of products." });
    }

    try {
        const requestedOrderDetails = await orderDetails(orderRequest);

        if (requestedOrderDetails.error) {
            return res.status(400).json({ error: requestedOrderDetails.error });
        }

        const orderTotal = (() => {
            const currencies = requestedOrderDetails.map(item => item.totalPrice.currency);
            
            const isSameCurrency = currencies.every(currency => currency === currencies[0]);
          
            if (!isSameCurrency) {
              throw new Error("Every item must have same currency!");
            }
          
            return {
              amount: requestedOrderDetails.reduce((total, item) => total + item.totalPrice.amount, 0),
              currency: currencies[0]
            };
          })();
          
        res.json({
            message: "Order processed successfully",
            orderDetails: requestedOrderDetails,
            totalPrice: orderTotal
        });
    } catch (error) {
        console.error("Order processing error:", error);
        res.status(500).json({ error: "An error occurred while processing the order." });
    }
}
