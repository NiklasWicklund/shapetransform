import { useDndContext, useDroppable } from '@dnd-kit/core';

export const RemoveArea = () => {
    /*component tat acts as a place where items can be dropped onto and deleted inside the dndContect,
    it is a drop target for the sortable items in the column component and you should be able to hover over it and see it change color
    */
    const { isOver, setNodeRef } = useDroppable({
        id: "remove-area",
      });

    return (
        <div
            ref={setNodeRef}
            style={{
                backgroundColor: isOver ? 'red' : 'transparent',
                width: '100%',
                padding: '20px 0',
            }}
        >
            Remove Area
        </div>
    );
  };