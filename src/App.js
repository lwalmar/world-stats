import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import './components/BarChart';
import BarChart from './components/BarChart';
import Map from './components/Map';
import {CountryInfo} from './components/CountryInfo';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

const countiesData = [
  {id: "CHN",	name: "China", "population": "1330141295"},
  {id: "IND",	name: "India", "population": "1173108018"},
  {id: "USA",	name: "United States", "population": "310232863"},
  {id: "IDN",	name: "Indonesia", "population": "242968342"},
  {id: "BRA",	name: "Brazil", "population": "201103330"},
  {id: "PAK",	name: "Pakistan", "population": "177276594"},
  {id: "BGD",	name: "Bangladesh", "population": "158065841"},
  {id: "NGA",	name: "Nigeria", "population": "152217341"},
  {id: "RUS",	name: "Russia", "population": "139390205"},
  {id: "JPN",	name: "Japan", "population": "126804433"},
  {id: "MEX",	name: "Mexico", "population": "112468855"},
  {id: "PHL",	name: "Philippines", "population": "99900177"},
  {id: "VNM",	name: "Vietnam", "population": "89571130"},
  {id: "ETH",	name: "Ethiopia", "population": "88013491"},
  {id: "DEU",	name: "Germany", "population": "82282988"},
  {id: "EGY",	name: "Egypt", "population": "80471869"},
  {id: "TUR",	name: "Turkey", "population": "77804122"},
  {id: "COD",	name: "Congo, Democratic Republic of the", "population": "70916439"},
  {id: "IRN",	name: "Iran", "population": "67037517"},
  {id: "THA",	name: "Thailand", "population": "66404688"},
  {id: "FRA",	name: "France", "population": "64057792"},
  {id: "GBR",	name: "United Kingdom", "population": "61284806"},
  {id: "ITA",	name: "Italy", "population": "58090681"}
];

function App() {
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  return (
    <div className="worldProfits">
      <div className="worldProfits_wrapper">
        <Map
          data={countiesData}
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
