import {React, useState,useEffect} from 'react';
import '../App.css';
import { create, all } from 'mathjs';
const ShearInput = (props) => {

    const math = create(all);
    const [values, setValues] = useState([props.matrix.get([0, 1]), props.matrix.get([1, 0])]);
    useEffect(() => {
        let xFloat = parseFloat(values[0] == '' ? 0 : values[0]);
        let yFloat = parseFloat(values[1] == '' ? 0 : values[1]);
        //Update x and y in the matrix if either of them are numbers
        if (!isNaN(xFloat) || !isNaN(yFloat)) {
            let newMatrix = math.clone(props.matrix);
            if (!isNaN(xFloat)) {
                //Shear matrix
                newMatrix.set([0, 1], xFloat);
            }
            if (!isNaN(yFloat)) {
                //Shear matrix
                newMatrix.set([1, 0], yFloat);
            }
            props.updateMatrix(props.id, newMatrix);
        }
    }
    , [values]);

    const handleChangeX = (event) => {
        let xFloat = parseFloat(event.target.value);
        if (!isNaN(xFloat)) {
            setValues([xFloat, values[1]]);
        }else if(event.target.value === ''){
            setValues(['', values[1]]);
        }
    }
    const handleChangeY = (event) => {
        let yFloat = parseFloat(event.target.value);
        if (!isNaN(yFloat)) {
            setValues([values[0], yFloat]);
        }else if(event.target.value === ''){
            setValues([values[0], '']);
        }
    }
    return (
        <div className='transform-input'>
            
            <input type="number" value={values[0]} onChange={handleChangeX}/>
            
            <input type="number" value={values[1]} onChange={handleChangeY}/>
        </div>
    );
};

export default ShearInput;
