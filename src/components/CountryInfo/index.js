import React, { useState, useEffect, useRef } from 'react';
import * as worldProfits from './data/worldProfits.json';
import * as worldCountries from '../Map/data/world_countries.json';
import StackChart from '../StackChart';
import './styles.css';

const getProfitsBreakdownData = (countryId) => {
  const countryProfitsData = worldProfits.default[countryId];

  return countryProfitsData
    ? [
      'dividendsAndBuybacks',
      'netDebtOfHouseholdsAndNISH',
      'netDebtOfGeneralGovernment',
      'fixedAssetsOfDomesticBusiness',
      'currentAccount',
      'otherFactors',
      'discrepancies'
    ].map((prop) => countryProfitsData.map((countryProfitData) => ({x: countryProfitData.period, y: countryProfitData.data[prop]})))
    : [];
};
const getProfitsData = (countryId) => {
  const countryProfitsData = worldProfits.default[countryId];

  return countryProfitsData
    ? countryProfitsData.map((countryProfitData) => ({x: countryProfitData.period, y: countryProfitData.data.profits}))
    : [];
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
  const [profitsBreakdownData, setProfitsBreakdownData] = useState(getProfitsBreakdownData(countryId));
  const [profitsData, setProfitsData] = useState(getProfitsData(countryId));
  const [countryName, setCountryName] = useState(getCountryName(countryId));
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    setHeight(ref.current.clientHeight)
    setWidth(ref.current.clientWidth)
  }, [countryId])

  return (
    <div className="countryInfo">
      <div className='countryInfo_title'>
        {countryName}
      </div>
      <div className='countryInfo_subtitle'>
        {'Profits after Taxes, $bln/year'}
      </div>
      <div
        className='countryInfo_chart'
        ref={ref}
      >
        <StackChart
          stackData={profitsBreakdownData}
          lineData={profitsData}
          width={width}
          height={height}
          margin={30}
        />
      </div>
    </div>
)};
