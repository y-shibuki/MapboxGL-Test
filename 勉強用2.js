
// mapboxgl.Popup を利用してポップアップのオブジェクトを設定
let popup = new mapboxgl.Popup({
closeButton: false,
closeOnClick: false
});


// マウスポインタがメッシュの領域に入ったら属性情報をポップアップで表示
map.on("mousemove", "2DmeshLayer", function(e) {

map.getCanvas().style.cursor = 'pointer';

popup.setLngLat(e.lngLat)
    .setHTML(
    "<div><b>市区町村コード &nbsp;</b>" + e.features[0].properties.SHICODE + "</div>" + 
    "<div><b>将来推計人口 2050年 (男女計)</b></div>" + 
    "<div>" + Math.round(e.features[0].properties.PT0_2050) + " 人</div>")
    .addTo(map);

});

// マウスポインタがメッシュの領域から離れたらポップアップをクリア
map.on("mouseleave", "2DmeshLayer", function() {
map.getCanvas().style.cursor = '';
popup.remove();
});
