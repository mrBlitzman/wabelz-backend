import Package from '../Schemas/packages.js';
import Extra from '../Schemas/extras.js';

export default async function orderDetails(products) {
    const productsList = [];
    let didMatch = false;
    
    for (const product of products) {
        let productTotalPrice;

        const packageMatch = await Package.findOne({ productID: product.id });
        if (packageMatch) {
            didMatch = true;
            productTotalPrice = packageMatch.price[0]?.amount * product.quantity;
            productsList.push({
                productID: packageMatch.productID,
                productType: "package",
                invoiceTitle: packageMatch.invoiceTitle || packageMatch.title,
                totalPrice: {amount: productTotalPrice, currency: packageMatch.price[0]?.currency}
            });
        } else {
            const extraMatch = await Extra.findOne({ productID: product.id });
            if (extraMatch) {
                didMatch = true;
                productTotalPrice = extraMatch.price[0]?.amount * product.quantity;
                productsList.push({
                    productID: extraMatch.productID,
                    productType: "extra",
                    invoiceTitle: extraMatch.invoiceTitle || extraMatch.title,
                    totalPrice: {amount: productTotalPrice, currency: extraMatch.price[0]?.currency}
                });
            }
        }
    }
    
    return didMatch ? productsList : { error: "No matching products found" };
}
