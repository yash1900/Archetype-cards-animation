import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface StatsChartProps {
  data: { label: string; value: number }[];
  size: number;
  color?: string;
}

const StatsChart: React.FC<StatsChartProps> = ({ data, size, color = "#2563eb" }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const radius = size / 2;
    const innerRadius = radius * 0.4;
    
    // Simple radial bar chart
    const g = svg.append("g")
      .attr("transform", `translate(${radius},${radius})`);

    // Scale
    const x = d3.scaleBand()
      .range([0, 2 * Math.PI])
      .align(0)
      .domain(data.map(d => d.label));

    const y = d3.scaleRadial()
      .range([innerRadius, radius])
      .domain([0, 100]);

    // Bars
    g.append("g")
      .selectAll("path")
      .data(data)
      .join("path")
      .attr("fill", color)
      .attr("fill-opacity", 0.6)
      .attr("d", d3.arc<any>()
        .innerRadius(innerRadius)
        .outerRadius(d => y(d.value))
        .startAngle(d => x(d.label)!)
        .endAngle(d => x(d.label)! + x.bandwidth())
        .padAngle(0.05)
        .padRadius(innerRadius)
      );

    // Labels (simplified)
    /* 
    g.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("text-anchor", function(d) { return (x(d.label)! + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
      .attr("transform", function(d) { return "rotate(" + ((x(d.label)! + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d.value) + 5) + ",0)"; })
      .append("text")
      .text(d => d.label)
      .attr("transform", function(d) { return (x(d.label)! + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
      .style("font-size", "6px")
      .attr("alignment-baseline", "middle")
      .attr("fill", "#666"); 
    */

  }, [data, size, color]);

  return <svg ref={svgRef} width={size} height={size} style={{ overflow: 'visible' }} />;
};

export default StatsChart;