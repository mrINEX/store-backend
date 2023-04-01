import { formatJSONResponse } from "libs/api-gateway";
import { middyfy } from "libs/lambda";
import { getProductService } from "libs/productService";
const productService = getProductService();
const getProducts = async () => {
    const products = await productService.getProducts();
    return formatJSONResponse({
        data: products,
        message: `products`,
    });
};
export const main = middyfy(getProducts);
//# sourceMappingURL=handler.js.map