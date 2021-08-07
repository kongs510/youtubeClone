const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        "/api",
        createProxyMiddleware({
            target: "https://reactyoutubekong.herokuapp.com/",
            changeOrigin: true,
        }),
    );
};
