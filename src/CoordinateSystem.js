import React from 'react';
import Plot from 'react-plotly.js';
import { create, all } from 'mathjs';


const CoordinateSystem = (props) => {
    const math = create(all);
  
    const colors = [
        'blue',
        'red',
        'green',
        'purple',
        'orange',
        'black',
        'brown',
        'pink',
        'yellow',
    ];


    const rgba = (color, opacity) => `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
    const createScatterPlot = (shape, name) => ({
        type: 'scatter',
        mode: 'lines+markers',
        x: shape.points.toArray()[0], // Extract x coordinates, mathjs matrix
        y: shape.points.toArray()[1], // Extract y coordinates from points
        name, // Set name of the trace
        fill: 'toself', // Fill the area enclosed by the points
        fillcolor: rgba(shape.color,shape.opacity), // Set the fill color
        line: { color: 'transparent' }, // Hide the lines connecting the points
        marker: {
            color: shape.points.toArray().map((point, index) => colors[index % colors.length]), // Set color based on index
            size: 8,
            opacity: 1,
        },
    });

  const data = Object.entries(props.shapes).map(([key, value]) => createScatterPlot(value, key));
  //TODO: Change so it takes in, start_shape, current_shape, and goal_shape
  // Each has a legend and different colors and opacities
  // props.shapes is a dictionary with the keys: original, yours, target and values: points, color, opacity, color each point in the shape differently
  return (

    <Plot
        data={data}
        layout={{
        autosize: true,
        aspectratio: {x: 1, y: 1},
      }}
      useResizeHandler
      className='coordinate-system'
      config={{ responsive: true }}
    />
  );
};

export default CoordinateSystem;
