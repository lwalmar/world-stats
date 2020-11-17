import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './components/Map';
import {CountryInfo} from './components/CountryInfo';
import * as worldProfits from './components/CountryInfo/data/worldProfits.json';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

const getCountriesProfitsData = () =>
  Object.keys(worldProfits.default).map((countryId) => {
    const profitsList = worldProfits.default[countryId];
    return ({
      id: countryId,
      profits: profitsList[profitsList.length - 1].data.profits
    })
});

function App() {
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [countiesProfits] = useState(getCountriesProfitsData());
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    setHeight(ref.current.clientHeight)
    setWidth(ref.current.clientWidth)
  }, [])

  return (
    <div className="worldProfits">
      <div className="worldProfits_title">{'Profits Atlas'}</div>
      <div
        className="worldProfits_wrapper"
        ref={ref}
      >
        <Map
          data={countiesProfits}
          height={height}
          onSelectedCountryIdChange={setSelectedCountryId}
          width={width}
        />
      </div>
      <Modal open={Boolean(selectedCountryId)} onClose={() => setSelectedCountryId(null)} center>
        <CountryInfo
          countryId={selectedCountryId}
        />
      </Modal>
    </div>
  );
}

export default App;
