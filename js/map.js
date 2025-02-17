let map;
      let placeSearch = null; // 地点搜索对象
      let currentMarker = null;
      let currentInfoWindow = null;

      // 路径规划相关变量
      let markers = {
        start: null,
        end: null
      };
      let startMarker = null;
      let endMarker = null;
      let driving = null;
      let currentRoute = null;

      let chargingLayer = null;
      let loca = null;
      let infoWindow = null;

      let bufferCircle = null; // 缓冲区圆形
      let bufferRadius = 1500; // 默认5公里半径
      let chargingPolesData = []; // 存储充电桩数据
      let isBufferMode = false; // 是否处于缓冲区模式

      // 添加在全局变量区域
      let heatmap = null; // 热力图实例
      const hefeiHeatmapData = [
        // ====== 庐阳区（老城核心区） ======
        { lng: 117.2838, lat: 31.8630, count: 180 },  // 淮河路步行街核心段
        { lng: 117.2789, lat: 31.8672, count: 160 },  // 城隍庙商圈
        { lng: 117.2723, lat: 31.8591, count: 150 },  // 三孝口新华书店
        { lng: 117.2911, lat: 31.8819, count: 145 },  // 蒙城路地铁站
        { lng: 117.2654, lat: 31.8736, count: 140 },  // 杏花公园
        { lng: 117.3033, lat: 31.8937, count: 135 },  // 合肥火车站南广场
        { lng: 117.2587, lat: 31.8652, count: 130 },  // 省立医院总院

        // ====== 蜀山区（西部科创带） ======
        { lng: 117.1334, lat: 31.8512, count: 150 },  // 创新产业园三期
        { lng: 117.1232, lat: 31.8398, count: 145 },  // 科大先研院
        { lng: 117.1608, lat: 31.8615, count: 140 },  // 大蜀山南入口
        { lng: 117.2134, lat: 31.8512, count: 135 },  // 西七里塘商圈
        { lng: 117.1932, lat: 31.8334, count: 130 },  // 合肥汽车西站
        { lng: 117.1738, lat: 31.8235, count: 125 },  // 合肥植物园

        // ====== 包河区（滨湖新城） ======
        { lng: 117.2938, lat: 31.7321, count: 170 },  // 融创茂购物中心
        { lng: 117.3021, lat: 31.7423, count: 160 },  // 金融港商务区
        { lng: 117.2876, lat: 31.7189, count: 155 },  // 巢湖观光栈道
        { lng: 117.2745, lat: 31.7654, count: 150 },  // 合肥南站东广场
        { lng: 117.3089, lat: 31.7123, count: 145 },  // 滨湖会展中心
        { lng: 117.2654, lat: 31.7832, count: 140 },  // 方兴湖公园

        // ====== 瑶海区（东部工业带） ======
        { lng: 117.3456, lat: 31.8812, count: 140 },  // 长江批发市场早市
        { lng: 117.3134, lat: 31.8634, count: 135 },  // 瑶海万达广场
        { lng: 117.3345, lat: 31.8432, count: 130 },  // 龙岗开发区
        { lng: 117.3023, lat: 31.9021, count: 125 },  // 合肥火车站北广场

        // ====== 政务文化新区（昼夜双高峰） ======
        { lng: 117.2214, lat: 31.8173, count: 160 },  // 市政大楼周边
        { lng: 117.2287, lat: 31.8149, count: 155 },  // 安徽广电中心
        { lng: 117.2356, lat: 31.8245, count: 150 },  // 华润大厦
        { lng: 117.2123, lat: 31.8021, count: 145 },  // 奥体中心

        // ====== 城市路网热力带 ======
        { lng: 117.2635, lat: 31.8523, count: 135 },  // 长江西路高架
        { lng: 117.2423, lat: 31.8321, count: 130 },  // 金寨路高架
        { lng: 117.3021, lat: 31.7423, count: 140 },  // 包河大道高架
        { lng: 117.1938, lat: 31.8515, count: 125 },  // 创新大道

        // ====== 教育科研热岛 ======
        { lng: 117.2234, lat: 31.7812, count: 140 },  // 合肥工业大学翡翠湖校区
        { lng: 117.2134, lat: 31.7756, count: 135 },  // 安徽大学磬苑校区
        { lng: 117.2534, lat: 31.8321, count: 130 },  // 中国科技大学东区
        { lng: 117.1732, lat: 31.8923, count: 125 },  // 科学岛（合肥物质研究院）

        // ====== 产业园区热源 ======
        { lng: 117.1534, lat: 31.9123, count: 130 },  // 北城双凤工业园
        { lng: 117.4123, lat: 31.7812, count: 125 },  // 东部新中心核心区
        { lng: 117.0834, lat: 31.9523, count: 120 },  // 岗集物流园

        // ====== 生态休闲热斑 ======
        { lng: 117.1745, lat: 31.8512, count: 120 },  // 大蜀山森林公园
        { lng: 117.3054, lat: 31.8654, count: 115 },  // 逍遥津公园
        { lng: 117.2654, lat: 31.7832, count: 110 },  // 塘西河公园

        // ====== 社区级热点（补充500米网格） ======
        // 庐阳区
        { lng: 117.2745, lat: 31.8723, count: 110 },  // 红星路文艺街区
        { lng: 117.2923, lat: 31.8634, count: 105 },  // 拱辰街菜市

        // 蜀山区  
        { lng: 117.2034, lat: 31.8432, count: 100 },  // 之心城购物中心
        { lng: 117.1923, lat: 31.8321, count: 95 },   // 贵池路美食街

        // 包河区
        { lng: 117.2843, lat: 31.7623, count: 105 },  // 罍街文创园
        { lng: 117.2654, lat: 31.7832, count: 100 },  // 方兴社区中心

        // 瑶海区
        { lng: 117.3321, lat: 31.8623, count: 110 },  // 宝业东城广场
        { lng: 117.3443, lat: 31.8921, count: 105 },  // 瑶海全民健身中心

        // ==== 交通微循环热点 ====
        { lng: 117.2736, lat: 31.8512, count: 115 },  // 三里庵地铁站
        { lng: 117.2543, lat: 31.8123, count: 110 },  // 南七里站换乘点
        { lng: 117.3023, lat: 31.7921, count: 120 },  // 合肥南站到达层

        // ==== 夜经济热点 ====
        { lng: 117.2837, lat: 31.8523, count: 150 },  // 老报馆酒吧街（22点后）
        { lng: 117.2712, lat: 31.8345, count: 140 },  // 宁国路龙虾一条街
        { lng: 117.2943, lat: 31.7321, count: 135 }   // 融创水世界夜场
      ];

      // 生成网格插值点函数
      function generateIDWPoints(originalData, gridSize = 0.005, power = 2) {
        // 合肥城区经纬度边界
        const bounds = {
          minLng: 117.08,
          maxLng: 117.41,
          minLat: 31.71,
          maxLat: 31.95
        };

        // 生成网格点
        const interpolatedData = [];
        for (let lng = bounds.minLng; lng <= bounds.maxLng; lng += gridSize) {
          for (let lat = bounds.minLat; lat <= bounds.maxLat; lat += gridSize) {
            let totalWeight = 0;
            let weightedSum = 0;

            // IDW计算
            originalData.forEach(point => {
              const distance = AMap.GeometryUtil.distance(
                [lng, lat],
                [point.lng, point.lat]
              );

              // 忽略1公里外的点以优化性能
              if (distance < 1000) {
                const weight = 1 / Math.pow(distance, power);
                weightedSum += point.count * weight;
                totalWeight += weight;
              }
            });

            if (totalWeight > 0) {
              const count = weightedSum / totalWeight;
              interpolatedData.push({
                lng: Number(lng.toFixed(5)),
                lat: Number(lat.toFixed(5)),
                count: Number(count.toFixed(2))
              });
            }
          }
        }
        return interpolatedData;
      }

      // 合并原始数据与插值数据
      const interpolatedPoints = generateIDWPoints(hefeiHeatmapData);
      const combinedHeatmapData = [...hefeiHeatmapData, ...interpolatedPoints];



      //初始化高德地图
      function initMap() {
        map = new AMap.Map('map-container', {
          zoom: 12,
          center: [117.27, 31.86], // 合肥市中心坐标
          mapStyle: 'amap://styles/light'
        });

        // 加载所有插件
        AMap.plugin(['AMap.Scale', 'AMap.ToolBar', 'AMap.ControlBar'], function () {
          // 添加比例尺控件（左下角）
          map.addControl(new AMap.Scale({
            position: 'LB'  // 左下角
          }));

          // 添加缩放工具条（左上角）
          map.addControl(new AMap.ToolBar({
            position: 'LT'  // 左上角
          }));

          // 添加控制条（右下角）
          map.addControl(new AMap.ControlBar({
            position: { bottom: "30px", right: "10px" }
          }));
        });

        // 加载充电桩数据
        fetch('./data/电动车充电桩.geojson') // 根据实际路径调整
          .then(response => response.json())
          .then(data => {
            chargingPolesData = data.features.map(f => ({
              lnglat: f.geometry.coordinates,
              properties: f.properties
            }));

          });

        // 初始化Loca
        loca = new Loca.Container({
          map: map,
        });

        // 初始化热力图
        map.plugin(["AMap.HeatMap"], function () {
          heatmap = new AMap.HeatMap(map, {
            radius: 28,
            opacity: [0.3, 0.8],
            gradient: {
              0.2: '#1E90FF',
              0.4: '#00BFFF',
              0.6: '#7CFC00',
              0.8: '#FFD700',
              1.0: '#FF4500'
            },
            zooms: [10, 18] // 设置显示层级范围
          });
          heatmap.setDataSet({
            data: combinedHeatmapData, // 使用合并后的数据
            max: Math.max(...combinedHeatmapData.map(p => p.count)) // 动态计算最大值
          });
          heatmap.hide(); // 默认隐藏
        });

        // 初始化插件（增加Driving插件初始化）
        AMap.plugin(["AMap.PlaceSearch", "AMap.Driving"], function () {
          placeSearch = new AMap.PlaceSearch({
            city: '合肥市',
            pageSize: 5,
            map: map
          });

          // 正确初始化路径规划服务
          driving = new AMap.Driving({
            policy: AMap.DrivingPolicy.LEAST_TIME,
            hideMarkers: true,  // 关闭默认标记
            showTraffic: true,
            map: null
          });
        });
      }

      // 路径规划点击处理
      function handleMapClickForRoute(e) {
        if (!startPoint) {
          startPoint = e.lnglat;
          updateInput('start-point', startPoint);
          addMarker(startPoint, 'start');
        } else if (!endPoint) {
          endPoint = e.lnglat;
          updateInput('end-point', endPoint);
          addMarker(endPoint, 'end');
        } else {
          clearMarkers();
          startPoint = e.lnglat;
          updateInput('start-point', startPoint);
          addMarker(startPoint, 'start');
          endPoint = null;
          document.getElementById('end-point').value = '';
        }
      }

      function addMarker(lnglat, type) {
        const icon = type === 'start' ?
          'https://webapi.amap.com/theme/v1.3/markers/n/start.png' :
          'https://webapi.amap.com/theme/v1.3/markers/n/end.png';

        if (type === 'start' && startMarker) map.remove(startMarker);
        if (type === 'end' && endMarker) map.remove(endMarker);

        const marker = new AMap.Marker({
          position: lnglat,
          icon: icon,
          map: map
        });

        if (type === 'start') startMarker = marker;
        else endMarker = marker;
      }

      function calculateRoute() {
        const infoPanel = document.getElementById('route-info-panel');
        if (!startPoint || !endPoint) {
          infoPanel.style.display = 'none'; // 隐藏面板
          alert('请先在地图上选择起点和终点');
          return;
        }

        // 清除旧路径
        if (currentRoute) {
          map.remove(currentRoute);
          currentRoute = null;
        }
        driving.clear();

        // 转换坐标格式为数组（保持经度在前）
        const start = [startPoint.lng, startPoint.lat];
        const end = [endPoint.lng, endPoint.lat];

        driving.search(start, end, (status, result) => {
          if (status === 'complete') {
            // 显示面板
            infoPanel.style.display = 'block';
            // 清除旧标记
            clearMarkers();

            // 新增路径绘制代码
            const path = result.routes[0].steps.flatMap(step => step.path);
            currentRoute = new AMap.Polyline({
              path: path,
              strokeColor: "#4A90E2",
              strokeWeight: 6,
              map: map  // 确保添加到地图
            });

            // 创建新标记（使用全局变量）
            startMarker = new AMap.Marker({
              position: start,
              icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
              map: map
            });

            endMarker = new AMap.Marker({
              position: end,
              icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
              map: map
            });

            // 显示路径信息
            showRouteInfo(result.routes[0]);
          } else {
            alert(`路径规划失败：${result?.info || '未知错误'}`);
          }
        });
      }


      function showRouteInfo(route) {
        // 时间格式转换函数
        const formatTime = (seconds) => {
          const hours = Math.floor(seconds / 3600);
          const minutes = Math.ceil((seconds % 3600) / 60);
          return hours > 0 ? `${hours}小时${minutes}分钟` : `${minutes}分钟`;
        };

        // 方向映射表
        const directionMap = {
          east: '东',
          west: '西',
          south: '南',
          north: '北',
          southwest: '西南',
          southeast: '东南',
          northeast: '东北',
          northwest: '西北'
        };

        // 构建详细路径步骤
        let stepHTML = [];
        let roadNames = [];

        route.steps.forEach((step, index) => {
          // 提取道路名称
          const roadName = step.road?.replace(/\(.*?\)/g, '') || '无名道路'; // 去除括号内容
          if (roadName) roadNames.push(roadName);

          // 解析方向信息
          const direction = step.instruction.match(/沿(.*?)向([^ ]+)/);
          const dirText = direction ?
            `沿${direction[1]}向${directionMap[direction[2]] || direction[2]}` :
            step.instruction;

          // 构建步骤信息
          stepHTML.push(`
            <div class="step-item">
                ${dirText}行驶${step.distance}米
                ${step.action || ''}
            </div>
        `);
        });

        // 构建完整HTML结构
        document.getElementById('route-info').innerHTML = `
        <div class="mb-2">
            ${roadNames.join(' > ')}
        </div>
        <div class="text-primary mb-2">
            ${formatTime(route.time)} (${(route.distance / 1000).toFixed(2)}公里)
        </div>
        ${stepHTML.join('')}
    `;
      }

      function clearRoute() {
        const infoPanel = document.getElementById('route-info-panel');
        // 清除所有路径相关元素
        if (currentRoute) {
          map.remove(currentRoute);
          currentRoute = null;
        }

        infoPanel.style.display = 'none';

        // 清除所有标记
        clearMarkers();

        // 强制清除输入框内容
        document.getElementById('start-point').value = '';
        document.getElementById('end-point').value = '';

        // 重置状态变量
        startPoint = endPoint = null;

        // 清除信息显示
        document.getElementById('route-info').innerHTML = '暂无路径数据';

        // 强制地图重绘
        map.setFitView();
      }

      function clearMarkers() {
        // 清除路径规划标记
        if (startMarker) {
          map.remove(startMarker);
          startMarker = null;
        }
        if (endMarker) {
          map.remove(endMarker);
          endMarker = null;
        }

        // 清除路径搜索结果中的标记
        driving?.clear(); // 清除Driving插件自动生成的标记
      }


      function updateInput(inputId, lnglat) {
        document.getElementById(inputId).value =
          `经度: ${lnglat.lng.toFixed(6)}, 纬度: ${lnglat.lat.toFixed(6)}`;
      }

      // 工具切换函数
      function switchTool(toolType) {
        map.off('click', handleMapClickForRoute);
        clearRoute();

        if (mouseTool) {
          mouseTool.close(true);
          map.getAllOverlays().forEach(overlay => {
            if (overlay.CLASS_NAME.includes('Poly')) map.remove(overlay);
          });
        }

        document.querySelectorAll('.tool-panel').forEach(panel => {
          panel.style.display = 'none';
        });

        if (toolType === 'measure') {
          document.getElementById('measure-panel').style.display = 'block';
          initMeasureTool();
        } else if (toolType === 'route') {
          document.getElementById('route-panel').style.display = 'block';
          map.on('click', handleMapClickForRoute);
        }
      }

      //页面加载时初始化地图
      window.onload = initMap;

      // 搜索地点
      function searchLocation() {
        const keyword = document.getElementById('search-input').value.trim();
        if (!keyword) {
          alert('请输入搜索关键词');
          return;
        }

        if (!placeSearch) {
          alert('搜索服务未初始化，请稍后重试');
          return;
        }

        placeSearch.search(keyword, function (status, result) {
          console.log("搜索状态:", status, "搜索结果:", result);
          if (status === 'complete' && result.info === 'OK') {
            const pois = result.poiList.pois;
            if (pois && pois.length > 0) {
              const firstPoi = pois[0];
              const lnglat = [firstPoi.location.lng, firstPoi.location.lat];

              if (currentMarker) map.remove(currentMarker);
              if (currentInfoWindow) currentInfoWindow.close();

              currentMarker = new AMap.Marker({ position: lnglat, map: map });

              currentInfoWindow = new AMap.InfoWindow({
                content: `<div style="padding: 5px;">${firstPoi.name}<br>${firstPoi.address}</div>`,
                offset: new AMap.Pixel(0, -30)
              });
              currentInfoWindow.open(map, lnglat);
              map.setCenter(lnglat);
              map.setZoom(16);
            } else {
              alert('未找到相关地点');
            }
          } else {
            alert('搜索失败，请检查网络或关键词');
          }
        });
      }

      // 处理回车键搜索
      function handleSearchKeyPress(event) {
        if (event.key === 'Enter') {
          searchLocation();
        }
      }

      // 测量工具相关变量
      let mouseTool = null;
      let measureType = 'distance';

      // 初始化测量工具，并通过监听 draw 事件获取绘制完成后的路径数据
      function initMeasureTool() {
        mouseTool = new AMap.MouseTool(map);
        mouseTool.on('draw', function (e) {
          let overlay = e.obj;
          let path = overlay.getPath();
          if (measureType === 'distance') {
            if (path && path.length > 1) {
              calculateDistance(path);
            }
          } else if (measureType === 'area') {
            if (path && path.length > 2) {
              calculateArea(path);
            }
          }
          mouseTool.close();
        });
        if (measureType === 'distance') {
          mouseTool.polyline({
            strokeColor: "#3366FF",
            strokeOpacity: 1,
            strokeWeight: 3,
          });
        } else if (measureType === 'area') {
          mouseTool.polygon({
            fillColor: "#FF3300",
            fillOpacity: 0.2,
            strokeColor: "#FF3300",
            strokeWeight: 2,
          });
        }
      }

      // 设置测量类型，并重新初始化测量工具
      function setMeasureType(type) {
        measureType = type;
        if (mouseTool) {
          mouseTool.close(true);
          map.getAllOverlays().forEach(overlay => {
            if (overlay.CLASS_NAME === "AMap.Polyline" || overlay.CLASS_NAME === "AMap.Polygon") {
              map.remove(overlay);
            }
          });
        }
        initMeasureTool();
      }

      // 计算距离（单位：米）并显示信息窗口
      function calculateDistance(path) {
        let total = AMap.GeometryUtil.distanceOfLine(path);
        let lastPoint = path[path.length - 1];
        showResult(`总距离：${total.toFixed(2)}米（${(total / 1000).toFixed(2)}公里）`, lastPoint);
      }

      // 计算面积（单位：平方米）并显示信息窗口
      function calculateArea(path) {
        let area = AMap.GeometryUtil.ringArea(path);
        let sumLng = 0, sumLat = 0;
        path.forEach(p => {
          sumLng += p.lng;
          sumLat += p.lat;
        });
        let center = new AMap.LngLat(sumLng / path.length, sumLat / path.length);
        showResult(`区域面积：${area.toFixed(2)}平方米`, center);
      }

      // 显示测量结果信息窗口
      function showResult(text, position) {
        if (currentInfoWindow) {
          currentInfoWindow.close();
        }
        currentInfoWindow = new AMap.InfoWindow({
          content: `<div class="p-2 bg-light rounded shadow-sm">${text}</div>`,
          offset: new AMap.Pixel(25, -30),
          anchor: 'bottom-center'
        });
        currentInfoWindow.open(map, position);
      }

      // 图层控制：实时路网
      let trafficLayer = null;
      function toggleLayer(layerType) {
        if (layerType === 'traffic') {
          if (!trafficLayer) {
            trafficLayer = new AMap.TileLayer.Traffic();
            trafficLayer.setMap(map);
          } else {
            trafficLayer.setMap(trafficLayer.getMap() ? null : map);
          }
        }
      }

      function toggleHeatmap() {
        if (!heatmap) {
          alert('热力图初始化未完成，请稍后再试');
          return;
        }
        const visible = !heatmap.getOptions().visible;
        heatmap.setOptions({ visible: visible });

        // 控制图例显示
        const legend = document.getElementById('heatmap-legend');
        legend.style.display = visible ? 'block' : 'none';

        // 调整地图视角显示合肥全貌
        if (visible) {
          map.setZoomAndCenter(11, [117.27, 31.86]);
        }
      }

      // 添加充电桩切换函数
      function toggleChargingPoles() {
        if (!isBufferMode) {
          // 进入缓冲区模式时显示充电桩
          if (!chargingLayer) {
            initChargingLayer();
          }
          showChargingPoles();
          startBufferAnalysis();
          isBufferMode = true;
        } else {
          // 退出缓冲区模式时保留充电桩显示
          clearBufferAnalysis();
          isBufferMode = false;
          map.setFitView();
        }
      }

      function startBufferAnalysis() {
        map.setStatus({ dragEnable: true });
        map.on('click', handleMapClickForBuffer);
        alert('请点击地图选择分析中心点');
      }

      function clearBufferAnalysis() {
        if (bufferCircle) {
          map.remove(bufferCircle);
          bufferCircle = null;
        }
        map.off('click', handleMapClickForBuffer);
        if (infoWindow) infoWindow.close();
      }

      function initChargingLayer() {
        if (!loca) {
          loca = new Loca.Container({
            map: map,
          });
        }

        chargingLayer = new Loca.LabelsLayer({
          zooms: [10, 20],
        });

        var geo = new Loca.GeoJSONSource({
          url: './data/电动车充电桩.geojson',
        });

        chargingLayer.setSource(geo);

        chargingLayer.setStyle({
          icon: {
            type: 'image',
            image: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/charging_pile.png',
            size: [48, 75],
            anchor: 'center',
          },
          text: {
            content: (index, feat) => feat.properties.name,
            style: {
              fontSize: 12,
              fontWeight: 'normal',
              fillColor: '#5CDE8E',
              strokeColor: '#000',
              strokeWidth: 2,
            },
            direction: 'bottom',
          },
          extData: (index, feat) => feat.properties,
        });

        loca.add(chargingLayer);

        // 添加鼠标交互事件
        chargingLayer.on('complete', () => {
          const markers = chargingLayer.getLabelsLayer().getAllOverlays();
          infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(0, -35),
            closeWhenClickMap: true
          });

          markers.forEach(marker => {
            marker.on('mouseover', (e) => {
              const extData = marker.getExtData();
              if (extData) {
                // 使用中文字段"地址"获取数据
                const address = extData.地址 || '暂无地址信息';
                infoWindow.setContent(`<div class="amap-info-window">地址：${address}</div>`);
                infoWindow.open(map, marker.getPosition());
              }
            });

            marker.on('mouseout', () => {
              infoWindow.close();
            });
          });
        });
      }

      function showChargingPoles() {
        if (loca && chargingLayer) {
          loca.add(chargingLayer);
          map.setFitView();
        }
      }

      function clearChargingPoles() {
        if (loca && chargingLayer) {
          loca.remove(chargingLayer);
          chargingLayer.destroy();
          chargingLayer = null;
          if (infoWindow) {
            infoWindow.close();
          }
        }
      }

      function handleMapClickForBuffer(e) {
        const center = e.lnglat;

        // 绘制缓冲区圆形
        if (bufferCircle) map.remove(bufferCircle);
        bufferCircle = new AMap.Circle({
          center: center,
          radius: bufferRadius,
          strokeColor: "#FF33FF",
          strokeOpacity: 0.2,
          fillColor: "#FF33FF",
          fillOpacity: 0.1,
          zIndex: 50
        });
        bufferCircle.setMap(map);

        // 执行空间分析
        analyzeChargingPoles(center);
      }

      function analyzeChargingPoles(center) {
        // 转换坐标为高德坐标系
        const centerLnglat = new AMap.LngLat(center.lng, center.lat);

        // 分析数据
        let count = 0;
        let minDistance = Infinity;
        let nearestPole = null;

        chargingPolesData.forEach(pole => {
          const distance = AMap.GeometryUtil.distance(
            centerLnglat,
            new AMap.LngLat(pole.lnglat[0], pole.lnglat[1])
          );

          if (distance <= bufferRadius) {
            count++;
            if (distance < minDistance) {
              minDistance = distance;
              nearestPole = pole;
            }
          }
        });

        // 显示结果
        const content = `
    <div class="p-2 bg-white rounded shadow">
      <h6>缓冲区分析结果</h6>
      <div>充电桩总数：${count}</div>
      ${nearestPole ? `
        <div class="mt-2">
          <div>最近充电桩：${nearestPole.properties.名称}</div>
          <div>地址：${nearestPole.properties.地址}</div>
          <div>距离：${(minDistance / 1000).toFixed(2)}公里</div>
        </div>
      ` : ''}
    </div>
  `;

        if (infoWindow) infoWindow.close();
        infoWindow = new AMap.InfoWindow({
          content: content,
          offset: new AMap.Pixel(0, -30)
        });
        infoWindow.open(map, center);
      }
