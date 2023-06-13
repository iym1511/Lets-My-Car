import { useEffect, useState } from "react";

const NaverApi = () => {

//   useEffect(() => {
//     // let map = null;
//     const initMap = () => {
//       const map = new naver.maps.Map("map", {
//         center: new naver.maps.LatLng(37.511337, 127.012084),
//         zoom: 13,
//       });
//     initMap();
//   } 
// }, []);

// const [startLocation, setStartLocation] = useState("");
// const [endLocation, setEndLocation] = useState("");

// const handleStartLocationChange = (event:React.ChangeEvent<HTMLInputElement>) => {
//   setStartLocation(event.target.value);
// };

// const handleEndLocationChange = (event:React.ChangeEvent<HTMLInputElement>) => {
//   setEndLocation(event.target.value);
// };

// const handleRouteSearch = () => {
//   if (startLocation && endLocation) {
//     const geocoder = new (naver as any).maps.services.Geocoder();
    
//     geocoder.geocode({ address: startLocation }, function (startResults: any, startStatus: any) {
//       if (startStatus === naver.maps.Service.Status.OK) {
//         const startCoord = startResults[0].result.items[0].point;

//         geocoder.geocode({ address: endLocation }, function (endResults: any, endStatus: any) {
//           if (endStatus === naver.maps.Service.Status.OK) {
//             const endCoord = endResults[0].result.items[0].point;

//             const directions = new (naver as any).maps.Directions({
//               map: Map,
//               panel: "directionsPanel",
//             });

//             directions.route({
//               start: startCoord,
//               end: endCoord,
//             });
//           } else {
//             alert("도착지 좌표를 찾을 수 없습니다.");
//           }
//         });
//       } else {
//         alert("출발지 좌표를 찾을 수 없습니다.");
//       }
//     });
//   }
// };

// useEffect(() => {
//   let map: naver.maps.Map | null | any = null;
//   let minimap: naver.maps.Map | null | any = null;
//   let semaphore = false;

//   const initMap = () => {
//     map = new naver.maps.Map("map", {
//       center: new naver.maps.LatLng(37.5666805, 126.9784147),
//       zoom: 13,
//       minZoom: 6,
//       mapTypeId: naver.maps.MapTypeId.NORMAL,
//       zoomControl: true,
//       zoomControlOptions: {
//         position: naver.maps.Position.TOP_RIGHT,
//       },
//       mapDataControl: false,
//       logoControlOptions: {
//         position: naver.maps.Position.LEFT_BOTTOM,
//       },
//       disableKineticPan: false,
//     });

//     naver.maps.Event.once(map, "init", function () {
//       map?.setOptions({
//         mapTypeControl: true,
//         scaleControl: false,
//         logoControl: false,
//       });

//       // 미니 맵이 들어갈 HTML 요소를 controls 객체에 추가합니다. 가장 오른쪽 아래에 위치하도록 다른 옵션들을 잠시 끕니다.
//       map?.controls[naver.maps.Position.BOTTOM_RIGHT].push(
//         document.getElementById("minimap")!
//       );
//       map?.setOptions({
//         scaleControl: true,
//         logoControl: true,
//       });

//       minimap = new naver.maps.Map("minimap", {
//         bounds: map?.getBounds(),
//         scrollWheel: false,
//         scaleControl: false,
//         mapDataControl: false,
//         logoControl: false,
//       });

//       naver.maps.Event.addListener(
//         map,
//         "bounds_changed",
//         function (bounds: naver.maps.Bounds) {
//           if (semaphore) return;

//           minimap?.fitBounds(bounds);
//         }
//       );

//       naver.maps.Event.addListener(
//         map,
//         "mapTypeId_changed",
//         function (mapTypeId: naver.maps.MapTypeId) {
//           const toTypes: any = {
//             normal: "hybrid",
//             terrain: "satellite",
//             satellite: "terrain",
//             hybrid: "normal",
//           };

//           if (!toTypes[mapTypeId]) {
//             return;
//           }

//           minimap?.setMapTypeId(toTypes[mapTypeId]);
//         }
//       );

//       naver.maps.Event.addListener(minimap, "drag", function () {
//         semaphore = true;
//         map?.panTo(minimap.getCenter());
//         naver.maps.Event.once(map, "idle", function () {
//           semaphore = false;
//         });
//       });

//       // 길찾기 기능 추가
//       const directions = new (naver as any).maps.Directions({
//         map: map,
//         panel: "directionsPanel",
//       });

//       directions.route({
//         start: new naver.maps.LatLng(37.5666805, 126.9784147), // 출발지 좌표
//         end: new naver.maps.LatLng(37.4979423, 127.0276217), // 도착지 좌표
//         // // 경유지 추가할 경우
//         // waypoints: [
//         //   new naver.maps.LatLng(37.5666805, 126.9784147),
//         //   new naver.maps.LatLng(37.4979423, 127.0276217),
//         // ],
//         // // 경로 탐색 옵션
//         // option: {
//         //   traffic: (naver as any).maps.DirectionsOption.TRAFFIC_TYPE_BEST,
//         // },
//       });
      
//     });
//   };

//   if (typeof window !== "undefined" && typeof window.naver !== "undefined") {
//     initMap(); // initMap 함수 호출
//   }
// }, []);

useEffect(() => {
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=ohhyvpd0jc&submodules=geocoder';
  document.head.appendChild(script);

  script.onload = () => {
    const mapOptions = {
      center: new naver.maps.LatLng(37.3614483, 127.1114883),
      zoom: 10,
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.RIGHT_CENTER,
      },
    };

    const map = new naver.maps.Map('map', mapOptions);

    const infoWindow = new (naver as any).maps.InfoWindow();

    const markerOptions = {
      position: mapOptions.center,
      map,
      clickable: true,
    };

    const marker = new naver.maps.Marker(markerOptions);

    const pinkMarkerOptions = {
      position: new naver.maps.LatLng(37.4857788, 127.0659301),
      map,
      icon: {
        content: [
          '<div class="cs_mapbridge">',
          '<div class="map_group _map_group">',
          '<div class="map_marker _marker tvhp tvhp_big">',
          '<span class="ico _icon"></span>',
          '<span class="shd"></span>',
          '</div>',
          '</div>',
          '</div>',
        ].join(''),
        size: new naver.maps.Size(38, 58),
        anchor: new naver.maps.Point(19, 58),
      },
    };

    const pinkMarker = new naver.maps.Marker(pinkMarkerOptions);
    pinkMarker.setTitle('Pink Marker');

    const greenMarkerOptions = {
      position: new naver.maps.LatLng(37.123267, 127.0659301),
      map,
      title: 'Green Marker',
      icon: {
        content: [
          '<div class="cs_mapbridge">',
          '<div class="map_group _map_group crs">',
          '<div class="map_marker _marker num1 num1_big"> ',
          '<span class="ico _icon"></span>',
          '<span class="shd"></span>',
          '</div>',
          '</div>',
          '</div>',
        ].join(''),
        size: new naver.maps.Size(38, 58),
        anchor: new naver.maps.Point(19, 58),
      },
      draggable: true,
    };

    const greenMarker = new naver.maps.Marker(greenMarkerOptions);

    const polylinePath = [
      new naver.maps.LatLng(37.1, 127.1),
      new naver.maps.LatLng(37.2, 127.2),
      new naver.maps.LatLng(37.3, 127.3),
      new naver.maps.LatLng(37.4, 127.4),
    ];

    const polylineOptions = {
      path: polylinePath,
      strokeColor: '#00CA00',
      strokeOpacity: 0.8,
      strokeWeight: 6,
      zIndex: 2,
      clickable: true,
      map,
    };

    const polyline = new (naver as any).maps.Polyline(polylineOptions);

    naver.maps.Event.addListener(polyline, 'mousedown', () => {
      polyline.setOptions({
        strokeWeight: 20,
      });
    });

    naver.maps.Event.addListener(polyline, 'mouseup', () => {
      polyline.setOptions({
        strokeWeight: 6,
      });
    });

    naver.maps.Event.addListener(polyline, 'click', () => {
      alert('polyline click');
    });

    naver.maps.Event.addListener(greenMarker, 'click', () => {
      infoWindow.setContent(getContentElement('Green Marker'));
      infoWindow.open(map, greenMarker);
    });

    function getContentElement(titleString: string) {
      const div = document.createElement('div');
      div.style.padding = '20px';
      div.innerText = titleString;
      return div;
    }
  };
}, []);





  return (  
    <div>
      <div id="map" style={{width:"50%", height:"50vh",border:"1px solid red", margin:"auto"}}></div>
      <div>
        {/* <input
          type="text"
          placeholder="출발지"
          value={startLocation}
          onChange={handleStartLocationChange}
        />
        <input
          type="text"
          placeholder="도착지"
          value={endLocation}
          onChange={handleEndLocationChange}
        />
        <button onClick={handleRouteSearch}>경로 찾기</button> */}
      </div>
      {/* <div id="directionsPanel"></div> */}
    </div>
  );
}

export default NaverApi;
