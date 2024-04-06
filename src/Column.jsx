import React from "react";

import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";

import DraggableTransformation from "./DraggableTransformation";

export const Column = ({ transformations,updateMatrix, removeTransformation,isSolved}) => {
    
    return (
        // if isSolved paint the background light green
        <div className={'list-container ' + (isSolved ? 'solved' : '')}>
            <SortableContext 
                items={transformations}
                strategy={verticalListSortingStrategy}
            >
                {transformations.map((transformation) => (
                    <DraggableTransformation
                        key={transformation.id}
                        id={transformation.id}
                        type={transformation.name}
                        available_values={transformation.available_values}
                        data={transformation}
                        modifieable={true}
                        updateMatrix = {updateMatrix}
                        removeTransformation={removeTransformation}
                        description={transformation.description}
                    />
                ))}
                
            </SortableContext>
        </div>
        
    );

};
