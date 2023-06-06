/** GTFS-RTをお試し **/
/* https://github.com/MobilityData/gtfs-realtime-bindings/blob/master/nodejs/README.md */
await axios.get("/toyama/chitetsu_tram/VehiclePositions.pb", { responseType: "arraybuffer" })
    .then(response => {
        const { data } = response,
            feed = transit_realtime.FeedMessage.decode(new Uint8Array(data));

        map.addSource("ToyamaLRTVehicle", {
            type: 'geojson',
            data: featureCollection(
                feed.entity.map(e => {
                    const { trip, position } = e.vehicle;
                    return point([position.longitude, position.latitude], { tripId: trip.tripId });
                })
            )
        });
        map.addLayer({
            id: "ToyamaLRTVehicle",
            type: "circle",
            source: "ToyamaLRTVehicle",
            paint: {
                'circle-color': "#f77",
                "circle-radius": hoge(4, 6),      // 地図上で半径を4mで固定する。
                "circle-stroke-color": "#f99",
                "circle-stroke-width": hoge(1, 1),
                "circle-pitch-alignment": "map", // カメラの角度に応じて、円の角度を変える。要するに、地面に円が貼り付いている様に見える。
            }
        })
    }).catch(error => {
        console.log(error);
        console.log("GTFSデータの取得に失敗しました");
    });