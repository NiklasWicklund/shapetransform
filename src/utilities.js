import { create, all } from 'mathjs';
const math = create(all);



function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function randomTranslate(values = null){
    //Create range from -3 to 3 without 0
    const range = [-3, -2, -1,0, 1, 2, 3];
    const x = range[randomInt(0, range.length - 1)];
    //Remove the 0 if x is 0
    if (x === 0){
        range.splice(range.indexOf(0), 1);
    }
    const y = range[randomInt(0, range.length - 1)];
    //Create a translation matrix
    return math.matrix([
        [1, 0, x],
        [0, 1, y],
        [0, 0, 1]
    ]);
}
function randomRotate(values = null){
    const angles = values ? values : [0, 45, 90, 135, 180, 225, 270];
    //remove the 0 angle
    angles.splice(angles.indexOf(0), 1);
    const angle = angles[randomInt(0, angles.length - 1)] * Math.PI / 180;
    //Create a rotation matrix
    return math.matrix([
        [Math.cos(angle), -Math.sin(angle), 0],
        [Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 1]
    ]);
}
function randomScale(values = null){
    const scales = values ? values : [0.5, 1, 1.5, 2];
    //remove the 1 scale
    const x = scales[randomInt(0, scales.length - 1)]
    if(x === 1){
        scales.splice(scales.indexOf(1), 1);
    }
    const y = scales[randomInt(0, scales.length - 1)]
    //Create a scale matrix
    return math.matrix([
        [x, 0, 0],
        [0, y, 0],
        [0, 0, 1]
    ]);
}
function randomShear(values = null){
    const range = [-3, -2, -1,0, 1, 2, 3]
    const x = range[randomInt(0, range.length - 1)];
    // Remove the 0 if x is 0
    if (x === 0){
        range.splice(range.indexOf(0), 1);
    }
    const y = range[randomInt(0, range.length - 1)];
    //Create a shear matrix
    return math.matrix([
        [1, x, 0],
        [y, 1, 0],
        [0, 0, 1]
    ]);
}
function generateCombinedMatrix(transformations){
    /*
        function that generates a combined matrix from a list of transformations

        param: transformations - a list of transformations
    */
    let matrix = math.identity(3);
    for (let i = 0; i < transformations.length; i++){
        matrix = math.multiply(matrix, transformations[i].matrix);
    }
    return matrix;
}
export function combinedMatrix(matrices){
    /*
        function that generates a combined matrix from a list of transformations

        param: transformations - a list of transformations
    */
    let matrix = math.identity(3);
    for (let i = 0; i < matrices.length; i++){
        matrix = math.multiply(matrix, matrices[i]);
    }
    return matrix;
}

function mergeSameType(transformations){
    /*
        function that goes through a list of transformations and combines adjacent transformations of the same type
    */
    let merged = [];
    let current = transformations[0];
    for (let i = 1; i < transformations.length; i++){
        if (current.name === transformations[i].name){
            console.log("Merged " + current.name + " with " + transformations[i].name);
            current.matrix = math.multiply(current.matrix, transformations[i].matrix);
        }else{
            merged.push(current);
            current = transformations[i];
        }
    }
    merged.push(current);
    return merged;
}
export function generateTransformations(amount,options){
    /*
        function that generates a random combination of transformations

        param: 
            amount - the number of transformations to generate
            options - the different available transformations and 'values' are possible values for the matrix, null=range
    */
    let transformations = [];
    const functions = {
        'Translate': randomTranslate,
        'Rotate': randomRotate,
        'Scale': randomScale,
        'Shear': randomShear
    }
    const numFunctions = Object.keys(functions).length;
    //Start to generate one of each transformation
    for(const key in options){
        const transform = options[key];
        transformations.push({
            name: transform.name,
            matrix: functions[transform.name](transform.values)
        });
    }
    //shuffle the transformations
    transformations.sort(() => Math.random() - 0.5);
    //If the amount is less than 4, return the first amount transformations
    if (amount <= numFunctions){
        transformations = transformations.slice(0, amount);
    }else{
        //Otherwise, generate random transformations until the amount is reached
        const remaining = amount - numFunctions;
        for (let i = 0; i < remaining; i++){
            const keys = Object.keys(options);
            const randomKey = keys[randomInt(0, keys.length - 1)];
            const transform = options[randomKey];
            transformations.push({
                name: transform.name,
                matrix: functions[transform.name]()
            });
        }
    }
    transformations = mergeSameType(transformations);
    
    const combinedMatrix = generateCombinedMatrix(transformations);
    const result = {
        'transformations': transformations,
        'combined': combinedMatrix,
        'numberOfTransformations': amount
    }
    return result;
}
export function randomShape(numberOfPoints){
    /*
        function that generates a random shape as a 3xnumberOfPoints matrix with the last row being 1 (homogeneous coordinates)
        OBS: points needs to be in drawing order for the fill to work

        param: numberOfPoints - the number of points in the shape
    */
    let shape = math.zeros(3, numberOfPoints);
    let points = []
    for (let i = 0; i < numberOfPoints; i++){
        //Need to create points so that the order never makes the shape cut itself
        let x = randomFloat(-5, 5);
        let y = randomFloat(-5, 5);
        while((x,y) in points){
            x = randomFloat(-5, 5);
            y = randomFloat(-5, 5);
        }
        shape.set([0, i], x);
        shape.set([1, i], y);
        shape.set([2, i], 1);
        points.push((x,y));
    }
    shape = math.zeros(3, 3);
    // Just create a triangle for now
    shape.set([0, 0], 0);
    shape.set([1, 0], 0);
    shape.set([2, 0], 1);
    shape.set([0, 1], 5);
    shape.set([1, 1], 0);
    shape.set([2, 1], 1);
    shape.set([0, 2], 0);
    shape.set([1, 2], 5);
    shape.set([2, 2], 1);
    return shape;
}