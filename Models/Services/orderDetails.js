import Pricings from "../Schemas/pricings.js";

export default async function orderDetails(products) {
  const orderList = [];
  let didMatch = false;

  for (const product of products) {
    const productMatch = await Pricings.findOne({ id: product.id });
    if (productMatch) {
      didMatch = true;
      if (Math.floor(+product.quantity) >= 1 || productMatch.type === "extra") {
        let quantity;

        if (
          productMatch.type === "package" ||
          productMatch.type === "quantity" ||
          productMatch.type === "element"
        ) {
          quantity = Math.floor(+product.quantity);
        } else if (productMatch.type === "extra") {
          quantity = 1;
        } else {
          quantity = 0;
        }

        orderList.push({
          id: productMatch.id,
          type: productMatch.type,
          invoiceTitle: productMatch.invoiceTitle || productMatch.title,
          price: productMatch.price,
          quantity: quantity,
        });
      }
    }
  }

  return didMatch ? orderList : { error: "No matching products found" };
}
