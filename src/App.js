import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import './components/BarChart';
import BarChart from './components/BarChart';
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
  return (
    <div className="worldProfits">
      <div className="worldProfits_wrapper">
        <Map
          data={countiesProfits}
          onSelectedCountryIdChange={setSelectedCountryId}
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
