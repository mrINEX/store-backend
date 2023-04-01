import { formatJSONResponse } from "libs/api-gateway";
import { middyfy } from "libs/lambda";
import { getProductService } from "libs/productService";
import { NotFound } from "http-errors";
const productService = getProductService();
export const getProduct = async (event) => {
    const products = await productService.getProducts();
    const product = products.find((product) => product.id === event.pathParameters.id);
    if (product == null) {
        throw new NotFound("Product not found");
    }
    return formatJSONResponse({
        data: product,
        message: `product`,
    });
};
export const main = middyfy(getProduct);
//# sourceMappingURL=handler.js.map