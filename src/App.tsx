import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './page/Home';

declare global {
  interface Window {
    kakao: any;
  }
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/">
          <Route index path='/' element={<Home />}/>
          {/* <Route path='/map' element={<kakaoMap />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
