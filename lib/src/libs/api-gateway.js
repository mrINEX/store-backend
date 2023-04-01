export const formatJSONResponse = (response) => {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(response),
    };
};
//# sourceMappingURL=api-gateway.js.map