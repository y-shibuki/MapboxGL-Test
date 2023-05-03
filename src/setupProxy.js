const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
    app.use(createProxyMiddleware("/toyama/chitetsu_tram/VehiclePositions.pb", {
        target: "https://gtfs-rt-files.buscatch.jp",
        changeOrigin: true,
    }));
    app.use(createProxyMiddleware("/toyama/chitetsu_tram/TripUpdates.pb", {
        target: "https://gtfs-rt-files.buscatch.jp",
        changeOrigin: true,
    }));
};