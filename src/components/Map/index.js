import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import * as topojson from "topojson";
import * as worldCountries from './data/world_countries.json';

class Map extends React.Component {
  componentDidMount() {
    this.updateChart();
  }

  componentDidUpdate() {
    this.updateChart();
  }

  async updateChart() {
    //this.updateScales();
    const { data } = this.props;

    const format = d3.format(',');

    const margin = {top: 0, right: 0, bottom: 0, left: 0};
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const color = d3.scaleThreshold()
      .domain([
        10000,
        100000,
        500000,
        1000000,
        5000000,
        10000000,
        50000000,
        100000000,
        500000000,
        1500000000
      ])
      .range([
        'rgb(247,251,255)',
        'rgb(222,235,247)',
        'rgb(198,219,239)',
        'rgb(158,202,225)',
        'rgb(107,174,214)',
        'rgb(66,146,198)',
        'rgb(33,113,181)',
        'rgb(8,81,156)',
        'rgb(8,48,107)',
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

    function ready(countriesData, population) {
      const populationById = {};
      population.forEach(d => { populationById[d.id] = +d.population; });
      countriesData.default.features.forEach(d => { d.population = populationById[d.id] });

      svg.append('g')
        .attr('class', 'countries')
        .selectAll('path')
        .data(countriesData.default.features)
        .enter().append('path')
        .attr('d', path)
        .style('fill', d => color(populationById[d.id]))
        .style('stroke', 'white')
        .style('opacity', 0.8)
        .style('stroke-width', 0.3)
        // tooltips
        .on('mouseover',function(d){
          //tip.show(d);
          d3.select(this)
            .style('opacity', 1)
            .style('stroke-width', 3);
        })
        .on('mouseout', function(d){
          //tip.hide(d);
          d3.select(this)
            .style('opacity', 0.8)
            .style('stroke-width',0.3);
        });

      svg.append('path')
        .datum(topojson.mesh(countriesData.default, (a, b) => a.id !== b.id))
        .attr('class', 'names')
        .attr('d', path);
    }
  }

  updateScales() {
    const { data, width, height } = this.props;
    this.scaleColor.domain([0, data.length]);
    this.scaleWidth
      .domain(data.map((d) => (d.item)))
      .range([0, width]);
    this.scaleHeight
      .domain(d3.extent(data, (d) => (d.count)))
      .range([height - 20, 0]);
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
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  animDuration: PropTypes.number
};

export default Map;