"use client";

import dynamic from "next/dynamic";
import React from "react";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface GeometryData {
  thickness_ne: number;
  thickness_pe: number;
  thickness_sep: number;
  length: number;
  width: number;
  porosity_ne: number;
  porosity_pe: number;
  porosity_sep: number;
}

interface GeometryPlotProps {
  className?: string;
  geometryData: GeometryData;
  scaled?: boolean;
}

export default function GeometryPlot({className, geometryData, scaled = false }: GeometryPlotProps) {
  const {
    thickness_ne,
    thickness_pe,
    thickness_sep,
    length,
    width,
    porosity_ne,
    porosity_pe,
    porosity_sep,
  } = geometryData;

  const totalThickness = thickness_ne + thickness_pe + thickness_sep;
  const length_um = length * 1e6;
  const width_um = width * 1e6;

  // Choose dimensions depending on scaled or not
  const dimensions = scaled
    ? [
        [thickness_ne, totalThickness, totalThickness],
        [thickness_sep, totalThickness, totalThickness],
        [thickness_pe, totalThickness, totalThickness],
      ]
    : [
        [thickness_ne, length_um, width_um],
        [thickness_sep, length_um, width_um],
        [thickness_pe, length_um, width_um],
      ];

  const colorscales = ["reds", "blues", "greens"];
  const colorbarxs = [-0.3, -0.26, -0.22];
  const showscales = [true, true, true];
  const colorbar_titles = ["Negative Electrode", "Separator", "Positive Electrode"];
  const thickmodes = ["array", "array", "auto"];
  const components = ["Negative electrode", "Separator", "Positive electrode"];
  const porosities = [porosity_ne, porosity_sep, porosity_pe];

  const traces: any[] = [];
  let start = 0;

  let maxX = 0;
  let maxY = scaled ? totalThickness : length_um;
  let maxZ = scaled ? totalThickness : width_um;

  for (let i = 0; i < dimensions.length; i++) {
    const [x, y, z] = dimensions[i];
    const porosity = porosities[i];
    const end = start + x;
    const intensity = Array(10).fill(porosity);

    const hoverText = Array(8).fill(
      `${components[i]}<br>Thickness: ${x.toFixed(2)} μm<br>Porosity: ${(porosity * 100).toFixed(1)}%`
    );

    traces.push({
      type: "mesh3d",
      x: [start, end, end, start, start, end, end, start],
      y: [0, 0, y, y, 0, 0, y, y],
      z: [0, 0, 0, 0, z, z, z, z],
      i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
      j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
      k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
      intensity: intensity,
      colorscale: colorscales[i],
      cmin: 0,
      cmax: 0.6,
      showscale: showscales[i],
      colorbar: {
        title: colorbar_titles[i],
        x: colorbarxs[i],
        tickmode: thickmodes[i],
        tickvals: [],
      },
      name: components[i],
      flatshading: true,
      hoverinfo: "text",
      hovertext: hoverText,
    });

    start = end;
    maxX = Math.max(maxX, end);
    maxY = Math.max(maxY, y);
    maxZ = Math.max(maxZ, z);
  }

  const layout = {
    legend: { yanchor: "top", y: 0.99, xanchor: "right", x: 1 },
    annotations: [
      {
        text: "Porosity",
        font: { size: 20, family: "arial", color: "black" },
        showarrow: false,
        xref: "paper",
        yref: "paper",
        x: -0.28,
        y: 1,
      },
    ],
    scene: {
      xaxis: {
        autorange: false,
        range: [0, maxX],
        title: "Thickness  /  μm",
      },
      yaxis: {
        autorange: false,
        range: [0, maxY],
        title: scaled ? "Scaled length  /  μm" : "Length  /  μm",
      },
      zaxis: {
        autorange: false,
        range: [0, maxZ],
        title: scaled ? "Scaled width  /  μm" : "Width  /  μm",
      },
      aspectmode: "data",
    },
    margin: { r: 10, l: 10, b: 10, t: 10 },
    autosize: true,
    responsive: true,
  };

  const config = {
    responsive: true,
    displayModeBar: true,
  };

  return (
    <div className = {className} style={{ width: "70%", height: "70%" }}>
      <Plot data={traces} layout={layout} config={config} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
