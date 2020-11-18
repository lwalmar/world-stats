import React from "react";
import PropTypes from "prop-types";
import Period from "../../modules/Period";
import * as d3 from "d3";
import './styles.css';

const formatFloat = (value) => {
  if (value) {
    return Math.round(value*100)/100;
  }
  return value
};

const formatPeriod = (stringRepr) => {
  if (stringRepr) {
    return Period.fromStringRepr(stringRepr).toString()
  }
  return stringRepr;
};

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

class StackChart extends React.Component {
  scaleHeight = d3.scaleLinear();
  scaleWidth = d3.scaleBand().padding(0.1);

  componentDidMount() {
    this.updateChart();
  }

  componentDidUpdate() {
    this.updateChart();
  }

  updateChart() {
    const { stackData, width, height, animDuration, margin} = this.props;
    if (width ===0 || height === 0 || stackData.length === 0) {
      return;
    }
    this.updateScales();

    const svg = d3.select(this.viz);

    barStack(stackData);
    const series = svg
      .selectAll(".series")
      .data(stackData);

    series.exit()
      .transition().duration(animDuration)
      .attr("y", height)
      .attr("height", 0)
      .style("fill-opacity", 0)
      .remove();

    series.enter()
      .append("g")
      .classed("series",true)
      .style("fill", (d) => d[0].color)
      .selectAll("rect").data(Object)
      .enter().append("rect")
      .attr("x", (d, i) => this.scaleWidth(d.x))
      .attr("y", (d) => this.scaleHeight(d.y0))
      .attr("height", (d) => (this.scaleHeight(0) - this.scaleHeight(d.size)))
      .attr("width", this.scaleWidth.bandwidth())
      .on("mouseover", function() { tooltip.style("display", null); })
      .on("mouseout", function() { tooltip.style("display", "none"); })
      .on("mousemove", function(event, d) {
        const xPosition = d3.pointer(event)[0] - 55;
        const yPosition = d3.pointer(event)[1] - 5;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(formatFloat(d.y));
      });

    var xAxis = d3.axisBottom()
      .scale(this.scaleWidth)
      .tickFormat(formatPeriod);

    var yAxis = d3.axisLeft()
      .scale(this.scaleHeight)
      .tickSize(6, 0);

    svg.append("g").attr("class","axis x").attr("transform","translate (0 "+(height - margin)+")").call(xAxis)
    svg.append("g").attr("class","axis y").attr("transform","translate ("+margin+" 0)").call(yAxis)
    const dividingLine = d3.line();
    svg.append("path").attr("class","barChart_dividingLine").attr("d", dividingLine(
      [
        [margin+1, this.scaleHeight(0)],
        [width, this.scaleHeight(0)]
      ]
    ))

    this.drawLine(svg);
    const tooltip = this.drawTooltip(svg)
  }

  drawLine (svg) {
    const {lineData} = this.props;
    const line = d3.line()
      .x((d) => this.scaleWidth(d.x) + this.scaleWidth.bandwidth()/2)
      .y((d) => this.scaleHeight(d.y));

    svg.append("path")
      .datum(lineData)
      .attr("class", "barChart_line")
      .attr("d", line);
  }

  drawTooltip (svg) {
    const tooltip = svg.append("g")
      .attr("class", "tooltip")
      .style("display", "none");

    tooltip.append("rect")
      .attr("width", 50)
      .attr("height", 20)
      .attr("fill", "white")
      .style("opacity", 0.5);

    tooltip.append("text")
      .attr("x", 25)
      .attr("dy", "1.2em")
      .style("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold");

    return tooltip;
  }

  updateScales() {
    const { stackData, width, height, margin } = this.props;
    if (stackData.length === 0) {
      return;
    }
    this.scaleWidth
      .domain(stackData[0].map((d) => d.x))
      .range([margin, width - margin]);

    barStack(stackData);
    this.scaleHeight
      .domain(stackData.extent)
      .range([ height - margin,0 + margin]);
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

StackChart.propTypes = {
  animDuration: PropTypes.number,
  margin: PropTypes.number,
  lineData: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  stackData: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired
};

StackChart.defaultProps = {
  animDuration: 600,
  margin: 0
};

export default StackChart;