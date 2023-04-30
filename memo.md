参考：https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/
やりたいこと：
https://qiita.com/amay077/items/8f0a415035816217b922
https://www.mapbox.jp/blog/building-cinematic-route-animations-with-mapboxgl
Mapboxのアクセストークン：pk.eyJ1Ijoic2hpYnVraSIsImEiOiJjbGRhZGJmd28waHNrM29ubjg3cjFhZWczIn0.sYAMGbs9eB0HdpDAmhz5aA

https://github.com/mapbox/mapbox-react-examples/tree/master/data-overlay/src

node 16で機能、18だと動かないかも。  
更新：18でも動きました。package.jsonを更新したので、node 18推奨。16だとopenSSLが古いとか言われる。
参考：npmのアップデート→https://omachizura.com/2016/02/npm-package-new.html

1. 1つのGeoJsonを表示 OK
2. バスをポイントで表示 OK
3. 線に沿って動かす OK
4. 複数のGeoJsonを表示 OK
5. 建物のOn、Offができるように OK
6. グラデーションでレイヤを表示できる様に

6. ホバーで駅名がわかるように
7. GTFSから混雑度がメッシュで表示できるように
8. レイヤの表示、非表示ができる様に
9. TypeScriptへの切り替え

## 構造
### src
* index.js  
こういうもの。基本的に変更しない。
* App.js  
こういうもの。基本的に変更しない。
* index.css  
こういうもの。基本的に変更しない。
* Map.css  
マップの表示に関するCSS。
* Map.js  
メインの処理を担う場所。

## めも
基本的に、チェックボックスとか、凡例とかは別ファイルに切る。  
GTFSのデータは必要なものだけを揃えている。  
SVGの編集:https://jakearchibald.github.io/svgomg/  
mapboxはロードする度に課金への道が進んでいる（50000回のロードで課金が始まる）
Plateauデータのストリーミング：https://github.com/Project-PLATEAU/plateau-streaming-tutorial

zoomレベルごとに半径を変える計算式  
https://blog.shimar.me/2022/11/03/mapbox-circle-layer