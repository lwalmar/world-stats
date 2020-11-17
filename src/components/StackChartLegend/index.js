import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import './styles.css';

const StackChartLegend = ({
  legendMap
}) => {
  return (<div className='stackChartLegend'>
    {
      Object.keys(legendMap).map((legendKey) => (
        <div className='stackChartLegend_item'>
          <div className={`stackChartLegend_${legendMap[legendKey].type}`} styles={`color: ${legendKey}`}></div>
          <div className='stackChartLegend_title'>{legendMap[legendKey].title}</div>
        </div>
      ))
    }
  </div>)
};

StackChartLegend.propTypes = {
  legendMap: PropTypes.shape({}).isRequired
};


export default StackChartLegend;