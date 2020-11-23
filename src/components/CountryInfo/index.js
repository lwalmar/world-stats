import React, { useState, useEffect, useRef } from 'react';
import * as worldProfits from './data/worldProfits.json';
import * as worldCountries from '../Map/data/world_countries.json';
import StackChart from '../StackChart';
import StackChartLegend from '../StackChartLegend';
import * as d3 from "d3";
import './styles.css';

const PROFITS_BREAKDOWN_UI_DATA = {
  dividendsAndBuybacks: {
    title: 'Dividends and Buybacks',
    type: 'stack',
    color: '#0C3B4E'
  },
  netDebtOfHouseholdsAndNISH: {
    title: 'Δ Net debt of Households and NISH',
    type: 'stack',
    color: '#D02428'
  },
  netDebtOfGeneralGovernment: {
    title: 'Δ Net debt of General Government',
    type: 'stack',
    color: '#176C76'
  },
  fixedAssetsOfDomesticBusiness: {
    title: 'Δ Fixed Assets of Domestic Business',
    type: 'stack',
    color: '#3EA45E'
  },
  currentAccount: {
    title: 'Current Account',
    type: 'stack',
    color: '#5F7658'
  },
  otherFactors: {
    title: 'Other factors',
    type: 'stack',
    color: '#FEBD46'
  },
  discrepancies: {
    title: 'Discrepancies',
    type: 'stack',
    color: '#B1B1B1'
  },
  profits: {
    title: 'Profit After Taxes [CP_D]',
    type: 'line',
    color: '#000000'
  }
};

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
    ].map((prop) => countryProfitsData.map((countryProfitData) => ({
      x: countryProfitData.period,
      y: countryProfitData.data[prop],
      color: PROFITS_BREAKDOWN_UI_DATA[prop].color,
      title: PROFITS_BREAKDOWN_UI_DATA[prop].title})
    ))
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
      <div className='countryInfo_chart'>
        <div
          className='countryInfoChart_canvas'
          ref={ref}
        >
          <StackChart
            lineData={profitsData}
            margin={40}
            height={height}
            stackData={profitsBreakdownData}
            width={width}
          />
        </div>
        {profitsBreakdownData.length && (
          <div className='countryInfo_legend'>
            <StackChartLegend
              legendMap={PROFITS_BREAKDOWN_UI_DATA}
            />
          </div>
        )}
      </div>
    </div>
)};
