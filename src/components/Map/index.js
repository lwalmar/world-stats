import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import * as topojson from "topojson";
import * as worldCountries from './data/world_countries.json';

class Map extends React.Component {
  componentDidMount() {
    this.updateChart();
  }

  async updateChart() {
    //this.updateScales();
    const { data, onSelectedCountryIdChange } = this.props;

    const format = d3.format(',');

    const margin = {top: 0, right: 0, bottom: 0, left: 0};
    const width = 1000 - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;

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

    function ready(countriesData, profits) {
      const profitsById = {};
      profits.forEach(d => {
        profitsById[d.id] = +d.profits;
      });
      countriesData.default.features.forEach(d => {
        d.profits = profitsById[d.id]
      });

      function clicked(event, data, item) {
        event.stopPropagation();
        onSelectedCountryIdChange(data.id);
      }

      const g = svg.append("g");

      g.append('g')
        .attr('class', 'countries')
        .selectAll('path')
        .data(countriesData.default.features)
        .enter().append('path')
        .on("click", clicked)
        .attr('d', path)
        .style('fill', d => color(profitsById[d.id]))
        .style('stroke', 'white')
        .style('opacity', 0.8)
        .style('stroke-width', 0.3)
        .on('mouseover', function (d) {
          d3.select(this)
            .style('opacity', 1)
            .style('stroke-width', 1);
        })
        .on('mouseout', function (d) {
          d3.select(this)
            .style('opacity', 0.8)
            .style('stroke-width', 0.3);
        });

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
  animDuration: PropTypes.number,
  data: PropTypes.array.isRequired,
  onSelectedCountryIdChange: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

export default Map;