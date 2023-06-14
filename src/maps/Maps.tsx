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


  const searchPlaces = (e:React.FormEvent<HTMLFormElement>) => {
    if (!searchKeyword.trim()) {
      alert("키워드를 입력해주세요!");
      return;
    }
    e.preventDefault();

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
      const marker = addMarker(placePosition, index);
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

  const addMarker = (position: any, idx: number) => {
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
    const truncate = (str:string, n:number) => {
      return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

    // 검색 목록
    let itemStr = `
      <div class="searchListBox">
      <div class="searchNumBox">
        <h5 class="markerbg marker_${index + 1} searchNumber">${index + 1}. &nbsp;</h5>
        <h5 class="searchTitle">${truncate(place.place_name, 19)}</h5>
      </div>
        <div class="searchLotNumBox">
          <p class="searchAddress">${place.address_name}</p>
          ${place.road_address_name !== "" ? `<p class="searchLotNum"><span>(지번)&nbsp;</span>${place.road_address_name}</p>` : ""}
          ${place.phone !== "" ? `<p class="searchNum">${place.phone}</p>` : ""}
        </div>
      </div>`;
  
    el.innerHTML = itemStr;
    el.className = "item";
    console.log(place)
    
    // 장소 항목 클릭 이벤트 추가
    el.addEventListener("click", () => {
      window.open(place.place_url, "_blank");
    });
  
    return el;
  };



  return (  
    <div>
      <MapBox>
        <Menu id="menu_wrap">
          <SearchBarBox>
          <MapLogo src={require("../img/kakaomap_logo.png")} alt="" />
            <SearchBar>
              <form onSubmit={searchPlaces}>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="장소, 주소 검색"
              />
              <button>
                <img src={require("../img/search-icon.png")}/>
              </button>
              </form>
            </SearchBar>
          </SearchBarBox>
          <SearchList id="placesList"></SearchList>
          <SearchPageNum id="pagination"></SearchPageNum>
        </Menu>
        <Map id="map"></Map>
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
  width: 400px;
  height: 80vh;
  overflow: scroll; 
`

const Menu = styled.div`
position: relative;
  width: 500px;
  border: 1px solid gray;
  div{
    margin: auto;
  }
  input{
    width: 278px;
    height: 40px;
    border:none;
    padding-left: 10px;
    font-size: 18px;
    font-weight: 500;
    border-radius: 4px;
    margin-bottom: 4px;
  }
  input:focus { outline: none; }
  button{
    background-color: rgba( 255, 255, 255, 0 );
    border: none;
    cursor: pointer;
    background-image: url("../img/search-icon.png");
  }
  img{
    width: 30px;
    position: relative;
    left: 10px;
    top: 8px;
  }
`
const MapLogo = styled.img`
  width: 120px !important;
  height: 30px;
  object-fit: none;
  object-position: 10px 5px;
  margin-left: 10px;
`

const SearchBar = styled.div`
  width: 350px;
  margin-top: 20px !important;
  background-color: white;
  border-radius: 4px;
  /* box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 2px 2px; */
  -webkit-box-shadow: 0 2px 1px 0 rgba(0,0,0,.15);
  -moz-box-shadow: 0 2px 1px 0 rgba(0,0,0,.15);
  box-shadow: 0 2px 1px 0 rgba(0,0,0,.15);
`

const SearchBarBox = styled.div`
  border: 1px solid #258fff;
  background-color: #258fff;
  height: 130px;
`

const SearchPageNum = styled.div`
  letter-spacing: 10px;
  text-align: center;
  a{
    color: black;
    text-decoration:none;
    margin: auto;
    cursor: pointer;
  }
`