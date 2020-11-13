import React, { useState } from 'react';
import * as worldProfits from './data/worldProfits.json';
import * as worldCountries from '../Map/data/world_countries.json';
import './styles.css';

const getCountryProfitData = (countryId) => {
  return worldProfits.default[countryId];
};
const getCountryName = (countryId) => {
  const countryInfo = worldCountries.default.features.find((item) => item.id === countryId);
  return countryInfo
    ? countryInfo.properties.name
    : null;
}

export const CountryInfo = ({
  countryId
}) => {
  const [countryProfitData, setcountryProfitData] = useState(getCountryProfitData(countryId));
  const [countryName, setCountryName] = useState(getCountryName(countryId));
  return (
    <div className="countryInfo">
      <div className='countryInfo_header'>
        {countryName}
      </div>
    </div>
)};
