import React from 'react';
import './App.css';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
const Transformation = (props) => {
    
    return (
        <div
            className='transformation'
            onClick={() => props?.onClick(props.data)}
        >
            <div className='type'>
                {props.type}
            </div>
            <div className='description'>
                {props.description}
            </div>
        </div>
    );
};

export default Transformation;
