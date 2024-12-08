import Pricings from "../Schemas/pricings.js";

export default async function orderDetails(products) {
    const orderList = [];
    let didMatch = false;

    for (const product of products) {

        const productMatch = await Pricings.findOne({ id: product.id });
        if (productMatch) {
            didMatch = true;
            orderList.push({
                id: productMatch.id,
                type: productMatch.type,
                invoiceTitle: productMatch.invoiceTitle || productMatch.title,
                price: productMatch.price,
                quantity:  productMatch.type == "package" ? Math.floor(product.quantity) : productMatch.type == "extra" ? 1 : 0
            });
        }
    }

    return didMatch ? orderList : { error: "No matching products found" };
}
