import {GameBoard} from "./gameboard";
import {Color, RandomColor} from "./color";

function main() {
    console.log('Loading');
    let GB = new GameBoard('canvas1');
    setInterval(() => {
        
        let x = Math.floor(Math.random() * (500 - 1) + 1);
        let y = Math.floor(Math.random() * (500 - 1) + 1);
        let r = Math.floor(Math.random() * (100 - 1) + 1);
        GB.drawCircle(x, y, r, RandomColor());        
        GB.paint();
    }, 1);
}

window.onload = (e) => {
    main();
}