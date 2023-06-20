import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import "../css/Maps.css";
import startMarkerImage from "../img/start.png";
import endMarkerImage from "../img/end.png";

let searchHistory: string[] = [];

const Maps = () => {
  const [map, setMap] = useState<any>();
  const [markers, setMarkers] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const infowindowRef = useRef<any>(null);

  // 목적지 장소명
  const [start, setStart] = useState<string>();
  const [end, setEnd] = useState<string>();
  // 목적지 마커
  const [startMarker, setStartMarker] = useState<any>();
  const [endMarker, setEndMarker] = useState<any>();
  // 목적지 좌표
  const [startplaceX, setStartplaceX] = useState<number | undefined>();
  const [startplaceY, setStartplaceY] = useState<number | undefined>();
  const [endplaceX, setEndplaceX] = useState<number | undefined>();
  const [endplaceY, setEndplaceY] = useState<number | undefined>();

  // searchPlaces 가 눌릴때 searchKeyword 값 저장해서 검색기록 남기기 
  const [isShow, setIsShow] = useState(false);
  const [searchArray, setSearchArray] = useState<any>();

  useEffect(() => {
    const mapCenter = new window.kakao.maps.LatLng(33.45042, 126.57091);
    const mapOption = {
      center: mapCenter,
      level: 5,
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

    // 출발 마커 설정
    const startSrc = startMarkerImage;
    const startSize = new window.kakao.maps.Size(40, 45);
    const startOption = {
      offset: new window.kakao.maps.Point(15, 43),
    };
    const startPosition = new window.kakao.maps.LatLng(
      startplaceY,
      startplaceX
    );
    const startImage = new window.kakao.maps.MarkerImage(
      startSrc,
      startSize,
      startOption
    );
    const startMarker = new window.kakao.maps.Marker({
      map: map,
      position: startPosition,
      image: startImage,
    });

    // 도착 마커 설정
    const endSrc = endMarkerImage;
    const endSize = new window.kakao.maps.Size(40, 45);
    const endOption = {
      offset: new window.kakao.maps.Point(15, 43),
    };
    const endPosition = new window.kakao.maps.LatLng(endplaceY, endplaceX);
    const endImage = new window.kakao.maps.MarkerImage(
      endSrc,
      endSize,
      endOption
    );
    const endMarker = new window.kakao.maps.Marker({
      map: map,
      position: endPosition,
      image: endImage,
    });
  }, []);

  useEffect(() => {
    // 출발 마커 설정
    const startSrc = startMarkerImage;
    const startSize = new window.kakao.maps.Size(40, 45);
    const startOption = {
      offset: new window.kakao.maps.Point(15, 43),
    };
    const startPosition = new window.kakao.maps.LatLng(
      startplaceY,
      startplaceX
    );
    const startImage = new window.kakao.maps.MarkerImage(
      startSrc,
      startSize,
      startOption
    );
    // 도착 마커 설정
    const endSrc = endMarkerImage;
    const endSize = new window.kakao.maps.Size(40, 45);
    const endOption = {
      offset: new window.kakao.maps.Point(15, 43),
    };
    const endPosition = new window.kakao.maps.LatLng(endplaceY, endplaceX);
    const endImage = new window.kakao.maps.MarkerImage(
      endSrc,
      endSize,
      endOption
    );

    // 기존에 생성된 마커가 있다면 제거
    if (startMarker) {
      startMarker.setMap(null);
    }
    if (endMarker) {
      endMarker.setMap(null);
    }

    // 새로운 마커 생성
    const newStartMarker = new window.kakao.maps.Marker({
      map: map,
      position: startPosition,
      image: startImage,
    });
    const newEndMarker = new window.kakao.maps.Marker({
      map: map,
      position: endPosition,
      image: endImage,
    });

    // 생성한 마커를 상태 변수로 업데이트
    setStartMarker(newStartMarker);
    setEndMarker(newEndMarker);
  }, [startplaceX, startplaceY, endplaceX, endplaceY]);

  const sessionArray: string | null | any = sessionStorage.getItem('searchArray')
  console.log(searchArray)

  const searchPlaces = (e: React.FormEvent<HTMLFormElement>) => {
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
    // 최근 검색어 저장
    let searchArray:string[] = searchHistory.concat(searchKeyword);
    searchHistory = searchArray;
    let sessionSearchArray:string[] | any = JSON.stringify(searchArray);
    sessionStorage.setItem('searchArray', sessionSearchArray);
    const sessionSearchArrays = JSON.parse(sessionArray)
    const SearchBoolean = sessionSearchArrays.some((data:string) => data == searchKeyword);
    if(SearchBoolean) {
      setSearchArray(sessionSearchArrays.filter((data: string) => data !== searchKeyword))
    }
    // setSearchArray(sessionSearchArray)

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
        window.open(place.place_url, "_blank");
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
      <div class="searchText" style="padding:5px;z-index:1;width:"200px";>
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
    const truncate = (str: string, n: number) => {
      return str?.length > n ? str.substr(0, n - 1) + "..." : str;
    };

    // 검색 목록
    let itemStr = `
      <div class="searchListBox">
      <div class="searchNumBox">
      <h5 class="markerbg marker_${index + 1} searchNumber">${
      index + 1
    }. &nbsp;</h5>
      <h5 class="searchTitle">${truncate(place.place_name, 17)}</h5>
      </div>
        <div class="searchLotNumBox">
          <p class="searchAddress">${place.address_name}</p>
          ${
            place.road_address_name !== ""
              ? `<p class="searchLotNum"><span>(지번)&nbsp;</span>${place.road_address_name}</p>`
              : ""
          }
          ${place.phone !== "" ? `<p class="searchNum">${place.phone}</p>` : ""}
          <div class="searchStartBox">
            <p>출발지</p>
            <p>도착지</p>
          </div>
        </div>
      </div>`;

    el.innerHTML = itemStr;
    el.className = "item";

    // 출발지
    const startElement: Element | any = el.querySelector(
      ".searchStartBox p:first-child"
    );
    startElement.addEventListener("click", () => {
      // 처리할 로직 작성
      setStart(place.place_name);
      setStartplaceY(place.y);
      setStartplaceX(place.x);
    });

    // 도착지
    const endElement: Element | any = el.querySelector(
      ".searchStartBox p:last-child"
    );
    endElement.addEventListener("click", () => {
      // 처리할 로직 작성
      setEnd(place.place_name);
      setEndplaceY(place.y);
      setEndplaceX(place.x);
    });

    // 장소 항목 클릭 이벤트 추가
    const searchListBox: Element | any = el.querySelector(".searchTitle");
    searchListBox.addEventListener("click", () => {
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
                <div style={{position:"absolute",display:"flex", alignContent:"center"}}>{searchArray}</div>
                <button>
                  <img src={require("../img/search-icon.png")} />
                </button>
              </form>
            </SearchBar>
          </SearchBarBox>
          <SearchList id="placesList"></SearchList>
          <SearchPageNum id="pagination"></SearchPageNum>
        </Menu>
        <Map id="map"></Map>
      </MapBox>
      <SearchStartbox>출발지 : {start}</SearchStartbox>
      <SearchEndbox>도착지 : {end}</SearchEndbox>
    </div>
  );
};

export default Maps;

const Map = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  margin: auto;
`;

const MapBox = styled.div`
  display: flex;
`;

const SearchList = styled.div`
  margin-top: 50px;
  width: 400px;
  height: 75vh;
  overflow: scroll;
`;

const Menu = styled.div`
  position: relative;
  width: 500px;
  border: 1px solid gray;
  div {
    margin: auto;
  }
  input {
    width: 278px;
    height: 40px;
    border: none;
    padding-left: 10px;
    font-size: 18px;
    font-weight: 500;
    border-radius: 4px;
    margin-bottom: 4px;
  }
  input:focus {
    outline: none;
  }
  button {
    background-color: rgba(255, 255, 255, 0);
    border: none;
    cursor: pointer;
    background-image: url("../img/search-icon.png");
  }
  img {
    width: 30px;
    position: relative;
    left: 10px;
    top: 8px;
  }
`;
const MapLogo = styled.img`
  width: 120px !important;
  height: 30px;
  object-fit: none;
  object-position: 10px 5px;
  margin-left: 10px;
`;

const SearchBar = styled.div`
  width: 350px;
  margin-top: 20px !important;
  background-color: white;
  border-radius: 4px;
  /* box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 2px 2px; */
  -webkit-box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.15);
`;

const SearchBarBox = styled.div`
  border: 1px solid #258fff;
  background-color: #258fff;
  height: 130px;
`;

const SearchPageNum = styled.div`
  letter-spacing: 10px;
  text-align: center;
  padding-top: 15px;
  a {
    color: black;
    text-decoration: none;
    margin: auto;
    cursor: pointer;
  }
  a.on {
    color: gray;
  }
`;
const SearchStartbox = styled.div`
  position: absolute;
  top: 10px;
  left: 470px;
  width: 200px;
  height: 40px;
  background-color: antiquewhite;
  z-index: 100;
`;

const SearchEndbox = styled.div`
  position: absolute;
  top: 70px;
  left: 470px;
  width: 200px;
  height: 40px;
  background-color: antiquewhite;
  z-index: 100;
`;
