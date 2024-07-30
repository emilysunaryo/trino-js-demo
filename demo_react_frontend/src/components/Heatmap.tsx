
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import nyc_borough_data from '../data/nyc_boroughs.json'


interface HeatmapProps {
    rideData: { boro_name: string; value: number }[]; // Ride request data
  }

interface GeoJsonFeatureData {
    type: "Feature";
    properties: {
        boro_code: string;
        boro_name: string;
        shape_area: string;
        shape_leng: string;
    };
    geometry: {
        type: "MultiPolygon";
        coordinates: number[][][][];
    }

}

interface GeoJsonData {
    type: "FeatureCollection";
    features: GeoJsonFeatureData[]
}
  
  function Heatmap({ rideData }: HeatmapProps) {
    const svgRef = useRef<SVGSVGElement | null>(null);
  
    useEffect(() => {
      const boroughs: GeoJsonData = nyc_borough_data as GeoJsonData;
      const svg = d3.select(svgRef.current);
      const width = 1000;
      const height = 1000;
  
      const projection = d3.geoAlbersUsa().scale(1070).translate([width / 2, height / 2]);
      const path = d3.geoPath().projection(projection);
  
      svg.append('g')
        .selectAll('path')
        .data(boroughs.features)
        .enter().append('path')
        .attr('d', path)
        .attr('fill', 'lightgrey')
        .attr('stroke', 'white');
    
      const maxValue = d3.max(rideData, d => d.value) ?? 0;
      const color = d3.scaleSequential(d3.interpolateReds).domain([0, maxValue]);
  
      svg.selectAll<SVGPathElement, GeoJsonFeatureData>('path')
        .data(boroughs.features)
        .attr('fill', (d: any) => {
          const boroughName = d.properties.boro_name;
          const boroughData = rideData.find(r => r.boro_name === boroughName);
          return boroughData ? color(boroughData.value) : 'lightgrey';
        });
    }, [rideData]);
  
    return <svg ref={svgRef} width="960" height="600"></svg>;
  }
  
  export default Heatmap;