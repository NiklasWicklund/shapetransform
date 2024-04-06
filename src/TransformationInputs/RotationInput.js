import React from 'react';
import '../App.css';
import {create, all} from 'mathjs';
const RotationInput = (props) => {

    const math = create(all);
    function handleChange(event) {
        // Update the matrix in props.matrix and send new one back with props.updateMatrix
        let angle = event.target.value;
        //convert angle to radians
        angle = angle * Math.PI / 180;
        //For rotation this means updating angles in the matrix
        let newMatrix = math.clone(props.matrix);
        newMatrix.set([0, 0], Math.cos(angle));
        newMatrix.set([0, 1], -Math.sin(angle));
        newMatrix.set([1, 0], Math.sin(angle));
        newMatrix.set([1, 1], Math.cos(angle));
        props.updateMatrix(props.id,newMatrix);
    }
    function getCurrentAngle(){
        // Gets the angle by solving the equation for the rotation matrix
        let a = props.matrix.get([0, 0]);
        let b = props.matrix.get([0, 1]);
        let c = props.matrix.get([1, 0]);
        let d = props.matrix.get([1, 1]);
        let radians = Math.atan2(c, a);
        let degrees = radians * 180 / Math.PI;
        
        if (degrees < 0){
            degrees = 360 + degrees;
        }
        degrees = Math.round(degrees);
        return degrees;
    }
    const currentAngle = getCurrentAngle();
    
    return (
        <div className='transform-input'>
            <select value={currentAngle} onChange={handleChange}>
                {props.available_values.map((value, index) => (
                    <option key={index} value={value}>{value}</option>
                ))}
            </select>
        </div>
    );
};

export default RotationInput;
