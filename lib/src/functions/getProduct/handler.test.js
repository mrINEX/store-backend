import { getProduct } from "./handler";
jest.mock("libs/productService");
describe("getProduct", () => {
    const event = {
        pathParameters: { id: "1" },
    };
    const context = {};
    const callback = () => { };
    test("should", async () => {
        const response = await getProduct(event, context, callback);
        expect(response).toBe({});
    });
});
//# sourceMappingURL=handler.test.js.map