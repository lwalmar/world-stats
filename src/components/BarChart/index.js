import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

const barStack = (seriesData) => {
  if (seriesData.length === 0) {
    return [];
  }
  var l = seriesData[0].length
  while (l--) {
    var posBase = 0; // positive base
    var negBase = 0; // negative base

    seriesData.forEach(function(d) {
      d = d[l]
      d.size = Math.abs(d.y)
      if (d.y < 0) {
        d.y0 = negBase
        negBase -= d.size
      } else
      {
        d.y0 = posBase = posBase + d.size
      }
    })
  }
  seriesData.extent = d3.extent(
    d3.merge(
      d3.merge(
        seriesData.map(function(e) {
          return e.map(function(f) { return [f.y0,f.y0-f.size] })
        })
      )
    )
  )
}

class BarChart extends React.Component {

  scaleColor = d3.scaleSequential(d3.interpolateViridis);
  scaleHeight = d3.scaleLinear();
  scaleWidth = d3.scaleBand().padding(0.1);

  componentDidMount() {
    this.updateChart();
  }

  componentDidUpdate() {
    this.updateChart();
  }

  updateChart() {
    const { data, width, height, animDuration, margin} = this.props;
    if (width ===0 || height === 0 || data.length === 0) {
      return;
    }
    this.updateScales();

    const svg = d3.select(this.viz);

    const seriesData = barStack(data);
    const series = svg
      .selectAll(".series")
      .data(data);

    series.exit()
      .transition().duration(animDuration)
      .attr("y", height)
      .attr("height", 0)
      .style("fill-opacity", 0)
      .remove();

    series.enter()
      .append("g")
      .classed("series",true)
      .style("fill", (d,i) => { return this.scaleColor(i) })
      .selectAll("rect").data(Object)
      .enter().append("rect")
      .attr("x", (d, i) => ( this.scaleWidth(i)))
      .attr("y", (d) => ( this.scaleHeight(d.y0) ))
      .attr("height", (d) => (this.scaleHeight(0) - this.scaleHeight(d.size)))
      .attr("width", this.scaleWidth.bandwidth());

    //var xAxis = d3.svg.axis()
    //  .scale(this.scaleWidth)
    //  .orient("bottom")
    //  .tickSize(6, 0);
    //
    //var yAxis = d3.svg.axis()
    //  .scale(this.scaleHeight)
    //  .orient("left");
    //
    //svg.append("g").attr("class","axis x").attr("transform","translate (0 "+this.scaleHeight(0)+")").call(xAxis)
    //svg.append("g").attr("class","axis y").attr("transform","translate ("+this.scaleWidth(margin)+" 0)").call(yAxis)
  }

  updateScales() {
    const { data, width, height } = this.props;
    this.scaleColor.domain([0, data.length]);
    this.scaleWidth
      .domain(data.map((d, i) => i))
      .range([0, width]);

    barStack(data);
    this.scaleHeight
      .domain(data.extent)
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

BarChart.defaultProps = {
  animDuration: 600
};

BarChart.propTypes = {
  data: PropTypes.array.isRequired,
  margin: PropTypes.number,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  animDuration: PropTypes.number
};

BarChart.defaultProps = {margin: 0};

export default BarChart;