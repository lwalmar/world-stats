import React, { useState, useEffect, useRef } from 'react';
import * as worldProfits from './data/worldProfits.json';
import * as worldCountries from '../Map/data/world_countries.json';
import StackChart from '../BarChart';
import './styles.css';

const getCountryProfitData = (countryId) => {
  const countryProfits = worldProfits.default[countryId];

  return countryProfits
    ? countryProfits.map((profitsByPeriod) => (
      [
        {y: profitsByPeriod.profits},
        {y: profitsByPeriod.dividendsAndBuybacks},
        {y: profitsByPeriod.netDebtOfHouseholdsAndNISH},
        {y: profitsByPeriod.netDebtOfGeneralGovernment},
        {y: profitsByPeriod.fixedAssetsofDomesticBusiness},
        {y: profitsByPeriod.currentAmount},
        {y: profitsByPeriod.otherFactors},
        {y: profitsByPeriod.discrepancies}
      ]
    ))
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
  const [countryProfitData, setcountryProfitData] = useState(getCountryProfitData(countryId));
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
      <div className='countryInfo_header'>
        {countryName}
      </div>
      <div
        className='countryInfo_chart'
        ref={ref}
      >
        <StackChart
          data={countryProfitData}
          width={width}
          height={height}
        />
      </div>
    </div>
)};
