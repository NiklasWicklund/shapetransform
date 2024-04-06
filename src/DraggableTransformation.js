import React from 'react';
import './App.css';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Close, Remove } from '@mui/icons-material';



const DraggableTransformation = (props) => {

    const {attributes, listeners,setNodeRef,transform,transition} = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return (
        <div 
            style={style}
            {...attributes}
            ref={setNodeRef}
            className='transformation'
        >
            <div
                {...listeners}
                className='drag-handle'
            >
                <DragIndicatorIcon />
            </div>
            <div className='type' draggable={false}>
                {props.type}
            </div>
            <div className='description' draggable={false}>
                <props.data.component 
                    id = {props.id}
                    available_values = {props.available_values} 
                    matrix = {props.data.matrix} 
                    data={props.data}
                    updateMatrix = {props.updateMatrix}
                />
            </div>
            <div>
                <Close 
                    style={{cursor: 'pointer'}}
                    onClick={() => props.removeTransformation(props.id)}
                />
            </div>
        </div>
    );
};

export default DraggableTransformation;
