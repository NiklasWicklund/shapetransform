import React from 'react';
import '../App.css';
import { create, all } from 'mathjs';
const ScaleInput = (props) => {

    const math = create(all);
    function handleChangeX(event) {
        // Update the matrix in props.matrix and send new one back with props.updateMatrix
        let scaleX = parseFloat(event.target.value);
        //For rotation this means updating angles in the matrix
        let newMatrix = math.clone(props.matrix);
        newMatrix.set([0, 0], scaleX);
        props.updateMatrix(props.id,newMatrix);
    }
    function handleChangeY(event) {
        let scaleY = parseFloat(event.target.value);
        let newMatrix = math.clone(props.matrix);
        newMatrix.set([1, 1], scaleY);
        props.updateMatrix(props.id,newMatrix);
    }
    //Get the current angle from the matrix, based on first cell in the rotation matrix
    const currentScaleX = props.matrix.get([0, 0]);
    const currentScaleY = props.matrix.get([1, 1]);
    return (
        <div className='transform-input'>
            
            <select defaultValue={currentScaleX} onChange={handleChangeX}>
                {props.available_values.map((value, index) => (
                    <option key={index} value={value}>{value}</option>
                ))}
            </select>
            
            <select defaultValue={currentScaleY} onChange={handleChangeY}>
                {props.available_values.map((value, index) => (
                    <option key={index} value={value}>{value}</option>
                ))}
            </select>
        </div>
    );
};

export default ScaleInput;
