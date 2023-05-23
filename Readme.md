# MapboxJS(仮称)

参考：https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/  
やりたいこと：  
https://qiita.com/amay077/items/8f0a415035816217b922  
https://www.mapbox.jp/blog/building-cinematic-route-animations-with-mapboxgl  
Mapboxのアクセストークンが必要  

https://github.com/mapbox/mapbox-react-examples/tree/master/data-overlay/src  

## 注意事項
node 16で機能、18だと動かないかも。  
更新：18でも動きました。package.jsonを更新したので、node 18推奨。16だとopenSSLが古いとか言われる。  
参考：npmのアップデート→https://omachizura.com/2016/02/npm-package-new.html  

## TODO
### Tasks
20. GTFSから混雑度がメッシュで表示できるように
21. GTFSの遅延情報を表示
### Done
1. 1つのGeoJsonを表示
2. バスをポイントで表示
3. 線に沿って動かす
4. 複数のGeoJsonを表示
5. 建物のOn、Offができるように
6. グラデーションでレイヤを表示できる様に
7. 建物表示を別レイヤに
8. ボタンを押したら、レイヤ選択画面が表示される（モーダルウィンドウ）
9. レイヤの表示、非表示ができる様に
10. Loading画面の実装
11. jsonファイルの読み込み
12. ホバーで駅名がわかるように
13. GTFS-RTの情報を表示
14. バスの路線の読み込み
15. 上に現在の時刻を表示
16. バスの場所を表示（時刻表）
17. 0時以降にも適切に動くように
18. LRTのリアルタイム情報を表示(富山だけど)
19. 駅名を常に表示する


## 構造
本格リリース時にはツリー構造で書きます・・・  
### src
* index.js・index.css  
こういうもの。基本的に変更しない。
* Map.css  
マップの表示に関するCSS。
* Map.js  
メインの処理を担う場所。  
* utils/gtfs.js
GTFSデータに関する処理。  
### public
* assets/  
GTFSデータなどのJSON、CSVデータが格納されている。
* index.html  
こういうもの。基本的に変更しない。

## めも
GTFSのデータはGTFS2JSONで別途加工してから読み込んでいます。  
SVGの編集:https://jakearchibald.github.io/svgomg/  
mapboxはロードする度に課金への道が進んでいる（50000回のロードで課金が始まる）  
Plateauデータのストリーミング：https://github.com/Project-PLATEAU/plateau-streaming-tutorial  
Mapにロード画面を追加：https://gis.stackexchange.com/questions/240134/mapbox-gl-js-source-loaded-event  
レイヤが多すぎると重くなるっぽい。できるだけ、同じレイヤにFeatureCollectionとしてまとめたい。  
読み込みすぎると、Chromeにキャッシュが溜まって動作がおかしくなるから、なんか変だったらcookieクリア  
Mapでmapを使う方法：https://stackoverflow.com/questions/31084619/map-a-javascript-es6-map  
zoomレベルごとに半径を変える計算式：https://blog.shimar.me/2022/11/03/mapbox-circle-layer  