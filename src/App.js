import { DndContext, KeyboardSensor, MouseSensor, PointerSensor, TouchSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core';
import './App.css';
import React, { useState } from 'react';
import CoordinateSystem from './CoordinateSystem';
import Transformation from './Transformation';
import { RemoveArea } from './RemoveArea';
import { Column } from './Column';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { ArrowBackIosNew, ArrowForwardIos, Delete, Redo, Undo } from '@mui/icons-material';
import { IconButton, Slider } from '@mui/material';
import { combinedMatrix, generateTransformations,randomShape } from './utilities';
import { create, all } from 'mathjs';
import ShearInput from './TransformationInputs/ShearInput';
import RotationInput from './TransformationInputs/RotationInput';
import ScaleInput from './TransformationInputs/ScaleInput';
import TranslateInput from './TransformationInputs/TranslateInput';
import Timer from './Timer';

function App() {

  const [transformations, setTransformations] = useState([]);
  const [solution, setSolution] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [numTransformations, setNumTransformations] = useState(2);

  const [shapes, setShapes] = useState({});
  const math = create(all);
  /* options are a list of different transformations, but here only id and name*/
  const options = [
    {
      name: 'Translate',
      description: 'Parameters: x, y',
      values: null,
      component: TranslateInput
    },
    {
      name: 'Rotate',
      description: 'Parameters: angle',
      values:[0, 45, 90, 135, 180, 225, 270], 
      component: RotationInput
    },
    {
      name: 'Scale',
      description: 'Parameters: x, y',
      values:[1,0.5,  1.5, 2],
      component: ScaleInput
    },
    {
      name: 'Shear',
      description: 'Parameters: x, y',
      values: null,
      component: ShearInput
    }
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  
  /*useEffect */
  React.useEffect(() => {
    newRound();
  }, [numTransformations]);
  const newRound = () => {
    setIsSolved(false);
    setStartTimer(true);
    setTransformations([]);
    const shape = randomShape(3);
    const newSolution = generateTransformations(numTransformations,options);
    setSolution(newSolution);
    var modifiedPoints = math.multiply(newSolution.combined, shape);

    // Make 3 copies, original, yours and target
    setShapes({
      original: {
        points: shape,
        color: [0, 0, 255],
        opacity: 0.2
      },
      yours: {
        points: shape,
        color: [0, 255, 0],
        opacity: 0.5
      },
      target: {
        points: modifiedPoints,
        color: [255, 0, 0],
        opacity: 0.2
      }
    });
  }
  React.useEffect(() => {
    if(shapes.yours === undefined) return;
    let yours = shapes.yours.points;
    let target = shapes.target.points;
    let diff = math.subtract(yours, target);
    let sum = math.sum(math.abs(diff));
    if(sum === 0){
      console.log("Correct transformation!");
      setIsSolved(true);
    }else if(isSolved){
      setIsSolved(false);
    }
  }, [shapes]);


  React.useEffect(() => {
    if(shapes.original === undefined) return;
    console.log("Transformations changed");
    let matrices = transformations.map(transformation => transformation.matrix);
    let combined = combinedMatrix(matrices);
    let shape = math.clone(shapes.original.points);
    let modifiedPoints = math.multiply(combined, shape);
    setShapes({
      ...shapes,
      yours: {
        points: modifiedPoints,
        color: shapes.yours.color,
        opacity: shapes.yours.opacity
      }
    });
  }
  , [transformations]);

  const removeTransformation = (id) => {
    setTransformations((transformations) => {
      return transformations.filter((transformation) => transformation.id !== id);
    });
  };
  const updateMatrix = (id, newMatrix) => {
    // Update the matrix for id in transformations
    setTransformations((transformations) => {
      return transformations.map((transformation
        ) => {
        if (transformation.id === id) {
          return { ...transformation, matrix: newMatrix };
        }
        return transformation;
      }
      );
    });
  };

  const timerStarted = () => {
    setStartTimer(false);
  }
  const getTransformPosition = (id) => {
    const index = transformations.findIndex(transformation => transformation.id === id);
    return index;
  };
  const handleDragEnd = (event) => {
    const {active, over} = event;
    

    if (!over) return;
    if (active.id === over.id) return;

    if (over.id === 'remove-area') {
      setTransformations((transformations) => {
        const oldIndex = getTransformPosition(active.id);
        return transformations.filter((_, index) => index !== oldIndex);
      });
      return;
    }
    setTransformations((transformations) => {

      const oldIndex = getTransformPosition(active.id);
      const newIndex = getTransformPosition(over.id);

      return arrayMove(transformations, oldIndex, newIndex);
    });
  };

  const handleOnOptionClick = (option) => {
    let newId = 1;
    if (transformations.length > 0) newId = Math.max(...transformations.map(t => t.id)) + 1;
    const newTransformation = { 
      id: newId,
      name: option.name,
      description: option.description,
      matrix: math.identity(3),
      available_values: option.values,
      component: option.component,
    };
    setTransformations([...transformations, newTransformation]);
  };

  const handleSolve = () => {
    if(solution === null) return;
    let answer = []
    for(let i = 0; i < solution.transformations.length; i++){
      let transformation = solution.transformations[i];
      let option = options.find(option => option.name === transformation.name);
      let newId = i + 1;
      const newTransformation = { 
        id: newId,
        name: transformation.name,
        description: option.description,
        matrix: transformation.matrix,
        available_values: option.values,
        component: option.component,
      };
      answer.push(newTransformation);
    }
    setTransformations(answer);
  }
    


  return (
    <div className="App">
      <div className='game-container'>
        <div className='coordinate-system'>
        <CoordinateSystem shapes={shapes} />
        </div>
        <div className='game-actions'>
          <div className='timer'>
            <Timer
              isSolved = {isSolved}
              start = {startTimer}
              timerStarted = {timerStarted}
            />
          </div>
        </div>
        <div className='game-actions'>
        <div className='transformations-slider'>
              <label>Number of transformations</label>
              <Slider
                aria-label="Number of transformations"
                defaultValue={2}
                value={numTransformations}
                getAriaValueText={(value) => `${value} transformations`}
                valueLabelDisplay="auto"
                shiftStep={30}
                onChange={(event, value) => setNumTransformations(value)}
                step={1}
                marks
                min={1}
                max={6}
              />
            </div>
        </div>
        <div className='game-actions'>
          <button onClick={newRound}>New round</button>
          <button onClick={handleSolve}>Solve</button>
          
        </div>
        <div className='action-container'>
          
            <div className='options'>
              <div className='header'>
                <div className='title'>
                  Options
                </div>
                <div className='actions'>

                </div>
              </div>
              <div className='list-container'>
                {options.map(option => (
                  <Transformation 
                    onClick={handleOnOptionClick}
                    key={option.id} 
                    data={option}
                    values={option.values}
                    type={option.name} 
                    description={option.description} />
                ))}
              </div>
            </div>
            <div className='selection'>
                <div className='header'>
                  <div className='title'>
                    Selection
                  </div>
                  <div className='actions'>
                    
                    <IconButton 
                      size="small" 
                      style={{ padding: '0', margin: '0' }}
                      onClick={() => setTransformations([])}
                      disabled={transformations.length === 0}
                      >
                      <Delete />
                    </IconButton>
                    
                  </div>
                </div>
                <DndContext 
                  collisionDetection={closestCorners}
                  onDragEnd={handleDragEnd}
                  sensors={sensors}
                >
                  <Column 
                    transformations={transformations} 
                    updateMatrix={updateMatrix}
                    removeTransformation={removeTransformation}
                    isSolved={isSolved}
                  />
                </DndContext>
            </div>
          
        </div>
        <div className='about'>
          <h3>How</h3>
          <p>Players are tasked with arranging transformation components such as rotation and translation in the correct order and assigning accurate values to recreate the target shape.</p>
          <h3>Why</h3>
          <p>Gain insights into how various transformations interact and influence each other.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
