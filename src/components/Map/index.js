import React from "react";
import Period from "../../modules/Period";
import PropTypes from "prop-types";
import * as d3 from "d3";
import {getMapTip} from "../../modules/map-tip.js";
import * as topojson from "topojson";
import * as worldCountries from './data/world_countries.json';
import './styles.css';

const formatPeriod = (stringRepr) => {
  if (stringRepr) {
    return Period.fromStringRepr(stringRepr).toString()
  }
  return stringRepr;
};

class Map extends React.Component {
  componentDidMount() {
    this.updateChart();
  }

  componentDidUpdate (prevProps) {
    if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
      this.updateChart();
    }
  }

  getTip () {
    // Set tooltips
    const tip = getMapTip()
      .attr('class', 'mapTooltip')
      .offset([-10, 0])
      .html(
        d => {
          return `<strong>Country: </strong><span class='mapTooltip_details'>${d.properties.name}</span><br>
          <strong>Profits: </strong><span class='mapTooltip_details'>${Math.round(d.profits)} $bln</span><br>
          <strong>Year: </strong><span class='mapTooltip_details'>${formatPeriod(d.period)}</span><br>
          `
        })

    tip.direction((d) => {
      if (d.properties.name === 'Antarctica') return 'n'
      // Americas
      if (d.properties.name === 'Greenland') return 's'
      if (d.properties.name === 'Canada') return 'e'
      if (d.properties.name === 'USA') return 'e'
      if (d.properties.name === 'Mexico') return 'e'
      // Europe
      if (d.properties.name === 'Iceland') return 's'
      if (d.properties.name === 'Norway') return 's'
      if (d.properties.name === 'Sweden') return 's'
      if (d.properties.name === 'Finland') return 's'
      if (d.properties.name === 'Russia') return 'w'
      // Asia
      if (d.properties.name === 'China') return 'w'
      if (d.properties.name === 'Japan') return 's'
      // Oceania
      if (d.properties.name === 'Indonesia') return 'w'
      if (d.properties.name === 'Papua New Guinea') return 'w'
      if (d.properties.name === 'Australia') return 'w'
      if (d.properties.name === 'New Zealand') return 'w'
      // otherwise if not specified
      return 'n'
    })

    tip.offset((d) => {
      // [top, left]
      if (d.properties.name === 'Antarctica') return [0, 0]
      // Americas
      if (d.properties.name === 'Greenland') return [10, -10]
      if (d.properties.name === 'Canada') return [24, -28]
      if (d.properties.name === 'USA') return [-5, 8]
      if (d.properties.name === 'Mexico') return [12, 10]
      if (d.properties.name === 'Chile') return [0, -15]
      // Europe
      if (d.properties.name === 'Iceland') return [15, 0]
      if (d.properties.name === 'Norway') return [10, -28]
      if (d.properties.name === 'Sweden') return [10, -8]
      if (d.properties.name === 'Finland') return [10, 0]
      if (d.properties.name === 'France') return [-9, 66]
      if (d.properties.name === 'Italy') return [-8, -6]
      if (d.properties.name === 'Russia') return [5, 385]
      // Africa
      if (d.properties.name === 'Madagascar') return [-10, 10]
      // Asia
      if (d.properties.name === 'China') return [-16, -8]
      if (d.properties.name === 'Mongolia') return [-5, 0]
      if (d.properties.name === 'Pakistan') return [-10, 13]
      if (d.properties.name === 'India') return [-11, -18]
      if (d.properties.name === 'Nepal') return [-8, 1]
      if (d.properties.name === 'Myanmar') return [-12, 0]
      if (d.properties.name === 'Laos') return [-12, -8]
      if (d.properties.name === 'Vietnam') return [-12, -4]
      if (d.properties.name === 'Japan') return [5, 5]
      // Oceania
      if (d.properties.name === 'Indonesia') return [0, -5]
      if (d.properties.name === 'Papua New Guinea') return [-5, -10]
      if (d.properties.name === 'Australia') return [-15, 0]
      if (d.properties.name === 'New Zealand') return [-15, 0]
      // otherwise if not specified
      return [-10, 0]
    })

    return tip;
  }

  updateChart() {
    if (this.props.width === 0 || this.props.height === 0) {
      return;
    }
    const tip = this.getTip();
    const { data, onSelectedCountryIdChange } = this.props;

    const margin = {top: 0, right: 0, bottom: 0, left: 0};
    const width = this.props.width - margin.left - margin.right;
    const height = this.props.height - margin.top - margin.bottom;

    const color = d3.scaleThreshold()
      .domain([
        0,
        50,
        100,
        150,
        200,
        250,
        300,
        350,
        400,
        450
      ])
      .range([
        'rgb(158,202,225)',
        'rgb(107,174,214)',
        'rgb(88,140,206)',
        'rgb(66,146,198)',
        'rgb(33,113,181)',
        'rgb(15,91,171)',
        'rgb(8,81,156)',
        'rgb(8,48,107)',
        'rgb(3,19,43)',
        'rgb(3,19,43)'
      ]);

    const svg = d3.select(this.viz)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('class', 'map');

    const projection = d3.geoMercator()
      .scale(150)
      .translate( [width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);
    ready(worldCountries, data)

    function ready(countriesData, profitsData) {
      const profitsDataById = {};
      profitsData.forEach(d => {
        profitsDataById[d.id] = d;
      });
      countriesData.default.features.forEach(d => {
        d.profits = +profitsDataById[d.id]?.profits;
        d.period = profitsDataById[d.id]?.period;
      });

      function clicked(event, data) {
        event.stopPropagation();
        if (data.profits) {
          onSelectedCountryIdChange(data.id);
        }
      }

      const g = svg.append("g");
      svg.call(tip)

      g.append('g')
        .attr('class', 'countries')
        .selectAll('path')
        .data(countriesData.default.features)
        .enter().append('path')
        .on("click", clicked)
        .attr('d', path)
        .style('fill', d => color(profitsDataById[d.id]?.profits))
        .style('stroke', 'white')
        .style('opacity', 0.8)
        .style('stroke-width', 0.3)
        // tooltips
        .on('mouseover', function(event, d) {
          if (d.profits) {
            tip.show(d, event)
            d3.select(this)
              .style('cursor', "pointer")
              .style('opacity', 1)
              .style('stroke-width', 1)
          }
        })
        .on('mouseout', function(event, d) {
          tip.hide(d, event)
          d3.select(this)
            .style('opacity', 0.8)
            .style('stroke-width', 0.3)
        })

      const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

      function zoomed(event) {
        const {transform} = event;
        g.attr("transform", transform);
        g.attr("stroke-width", 1 / transform.k);
      }

      svg.call(zoom);

      svg.append('path')
        .datum(topojson.mesh(countriesData.default, (a, b) => a.id !== b.id))
        .attr('class', 'names')
        .attr('d', path);
    }

    return svg.node()
  }

  render() {
    const { width, height } = this.props;
    return (
      <svg ref={ viz => (this.viz = viz) }
           width={width} height={height} >
      </svg>
    );
  }
}

Map.defaultProps = {
  animDuration: 600
};

Map.propTypes = {
  animDuration: PropTypes.number,
  data: PropTypes.array.isRequired,
  onSelectedCountryIdChange: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

export default Map;