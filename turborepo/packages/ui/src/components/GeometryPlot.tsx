"use client";

import dynamic from "next/dynamic";
import React from "react";
import type { Layout, PlotData } from "plotly.js";

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

// Extend PlotData for mesh3d so TS knows about intensity
interface Mesh3DTrace extends Partial<PlotData> {
  type: "mesh3d";
  x: Float32Array;
  y: Float32Array;
  z: Float32Array;
  i: Float32Array;
  j: Float32Array;
  k: Float32Array;
  intensity?: number[] | Float32Array;
  cmin?: number;
  cmax?: number;
  flatshading?: boolean;
}

export default function GeometryPlot({
  className,
  geometryData,
  scaled = false,
}: GeometryPlotProps) {
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

  // Strongly type dimensions as tuple array
  const dimensions: [number, number, number][] = scaled
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
  const showscales = [false, true, false];
  const components = ["Negative electrode", "Separator", "Positive electrode"];
  const porosities = [porosity_ne, porosity_sep, porosity_pe];
  const thickmodes = ["array", "array", "auto"];

  const traces: Mesh3DTrace[] = [];
  let start = 0;

  let maxX = totalThickness;
  let maxY = scaled ? totalThickness : length_um;
  let maxZ = scaled ? totalThickness : width_um;

  for (let i = 0; i < dimensions.length; i++) {
    const dim = dimensions[i];

    // Runtime guard for safety
    if (!dim) continue;

    const [x, y, z] = dim;
    const porosity = porosities[i];
    if (porosity == null) continue;

    // Extra safety in case values are missing
    if (x == null || y == null || z == null) continue;

    const end = start + x;
    const intensity = Array(10).fill(porosity);

    const hoverText = Array(8).fill(
      `${components[i]}<br>Thickness: ${x.toFixed(
        2
      )} μm<br>Porosity: ${(porosity * 100).toFixed(1)}%`
    );

    traces.push({
      type: "mesh3d",
      x: Float32Array.from([start, end, end, start, start, end, end, start]),
      y: Float32Array.from([0, 0, y, y, 0, 0, y, y]),
      z: Float32Array.from([0, 0, 0, 0, z, z, z, z]),
      i: Float32Array.from([7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2]),
      j: Float32Array.from([3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3]),
      k: Float32Array.from([0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6]),
      intensity,
      colorscale: colorscales[i],
      cmin: 0,
      cmax: 0.6,
      showscale: showscales[i],
      colorbar: {
        x: colorbarxs[i],
        tickmode: thickmodes[i] as any,
        tickvals: [] as number[],
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

  const layout: Partial<Layout> = {
    scene: {
      xaxis: {
        autorange: true,
        range: [0, maxX],
        title: { text: "Thickness / μm" },
      },
      yaxis: {
        autorange: true,
        range: [0, maxY],
        title: scaled ? { text: "Scaled length / μm" } : { text: "Length / μm" },
      },
      zaxis: {
        autorange: true,
        range: [0, maxZ],
        title: scaled ? { text: "Scaled width / μm" } : { text: "Width / μm" },
      },
      aspectmode: "data",
    },
    margin: { r: 10, l: 10, b: 10, t: 10 },
    autosize: false,
  };

  const config = {
    responsive: true,
    displayModeBar: true,
  };

  return (
    <div className={className} style={{ width: "80%" }}>
      <Plot
        data={traces}
        layout={{ ...layout, autosize: true }}
        config={config}
        style={{ width: "100%", height: "500px" }}
        useResizeHandler={true}
      />
    </div>
  );
}
