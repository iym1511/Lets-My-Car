import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import "../css/Maps.css"

const Maps = () => {

  const [map, setMap] = useState<any>();
  const [markers, setMarkers] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const infowindowRef = useRef<any>(null);

  useEffect(() => {
    const mapOption = {
      center: new window.kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };

    const map = new window.kakao.maps.Map(
      document.getElementById("map"),
      mapOption
    );

    const mapTypeControl = new window.kakao.maps.MapTypeControl();
    map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

    const zoomControl = new window.kakao.maps.ZoomControl();
    map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

    setMap(map);
  }, []);


  const searchPlaces = () => {
    if (!searchKeyword.trim()) {
      alert("키워드를 입력해주세요!");
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchKeyword, placesSearchCB);
  };

  const placesSearchCB = (data: any, status: any, pagination: any) => {
    if (status === window.kakao.maps.services.Status.OK) {
      displayPlaces(data);
      displayPagination(pagination);
    } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
      alert("검색 결과가 존재하지 않습니다.");
    } else if (status === window.kakao.maps.services.Status.ERROR) {
      alert("검색 결과 중 오류가 발생했습니다.");
    }
  };


  const displayPlaces = (places: any[]) => {
    const listEl: any = document.getElementById("placesList");
    const bounds = new window.kakao.maps.LatLngBounds();

    removeAllChildNodes(listEl);
    removeMarkers();

    places.forEach((place, index) => {
      const placePosition = new window.kakao.maps.LatLng(place.y, place.x);
      const marker = addMarker(placePosition, index, place);
      const itemEl = getListItem(index, place);

      bounds.extend(placePosition);

      marker.addListener("click", () => {
        displayInfowindow(marker, place.place_name);
      });

      // marker.addListener("mouseout", () => {
      //   infowindowRef.current.close();
      // });

      itemEl.addEventListener("mouseover", () => {
        displayInfowindow(marker, place.place_name);
      });

      itemEl.addEventListener("mouseout", () => {
        infowindowRef.current.close();
      });

      listEl.appendChild(itemEl);
    });

    map.setBounds(bounds);
  };

  const addMarker = (position: any, idx: number, place: any) => {
    const imageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";
    const imageSize = new window.kakao.maps.Size(36, 37);
    const imgOptions = {
      spriteSize: new window.kakao.maps.Size(36, 691),
      spriteOrigin: new window.kakao.maps.Point(0, idx * 46 + 10),
      offset: new window.kakao.maps.Point(13, 37),
    };
    const markerImage = new window.kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imgOptions
    );
    const marker = new window.kakao.maps.Marker({
      position,
      image: markerImage,
    });
    marker.addListener("click", () => {
      // window.open(place.place_url, "_blank");
    });
    marker.setMap(map);
    setMarkers((prevMarkers) => [...prevMarkers, marker]);
    return marker;
  };

  const removeMarkers = () => {
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    setMarkers([]);
  };

  const displayInfowindow = (marker: any, title: string) => {
    if (!infowindowRef.current) {
      infowindowRef.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });
    }

    // 마커에 마우스를 올리면 나타나는 정보
    const content = `
    <div>
      <div style="padding:5px;z-index:1;">
        ${title}
      </div>
    </div>
      `;
    infowindowRef.current.setContent(content);
    infowindowRef.current.open(map, marker);
  };

  const displayPagination = (pagination: any) => {
    const paginationEl: any = document.getElementById("pagination");
    removeAllChildNodes(paginationEl);

    for (let i = 1; i <= pagination.last; i++) {
      const el = document.createElement("a");
      el.href = "#";
      el.innerHTML = i.toString();

      if (i === pagination.current) {
        el.className = "on";
      } else {
        el.onclick = () => {
          pagination.gotoPage(i);
        };
      }

      paginationEl.appendChild(el);
    }
  };

  const removeAllChildNodes = (el: HTMLElement | null | any) => {
    if (el) {
      while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
      }
    }
  };

  const getListItem = (index: number, place: any) => {
    const el = document.createElement("div");

    const border = styled.div`
    width: 500px;
    `
    // 검색 목록
    let itemStr = `
      <span class="markerbg marker_${index + 1}">${index + 1}</span>
      <div class="searchListBox">
        <h5>${place.place_name}</h5>
        <span>${place.address_name}</span>
        <span class="tel">${place.phone}</span>
      </div>`;
  
    el.innerHTML = itemStr;
    el.className = "item";
    console.log(place);
    
    
    // 장소 항목 클릭 이벤트 추가
    el.addEventListener("click", () => {
      window.open(place.place_url, "_blank");
    });
  
    return el;
  };



  return (  
    <div>
      <MapBox>
        <Map id="map"></Map>
        <Menu id="menu_wrap">
        <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button onClick={searchPlaces}>Search</button>
          <SearchList id="placesList">

          </SearchList>
          <div id="pagination"></div>
        </Menu>
    </MapBox>
  </div>
  );
}

export default Maps;


const Map = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  margin: auto;
`

const MapBox = styled.div`
  display: flex;
`

const SearchList = styled.div`
  margin-top: 50px;
  width: 100%;
  height: 80vh;
  overflow: scroll;
  
`

const Menu = styled.div`
  border: 1px solid red;
  width: 25%;
  input{
    margin-top: 20px;
    width: 12vw;
    height: 40px;
  }
  button{
    height: 45px;
  }
`