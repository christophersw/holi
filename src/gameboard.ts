import {Color} from "./color";

export interface IGameBoard {
    paint(): void;
    drawPixel(x: number, y: number, color): void;
    drawLine(x0:number,y0:number, x1:number, y1:number, color:Color): void;
    drawCircle(x:number, y:number, radius:number, color:Color): void;
}

export class GameBoard implements IGameBoard {
    static canvas: HTMLCanvasElement;
    static canvasWidth: number;
    static canvasHeight: number;
    static context: CanvasRenderingContext2D;
    static imageData: ImageData;
    static buf: ArrayBuffer;
    static buf8: Uint8ClampedArray;
    static data: Uint32Array;

    constructor(canvasId: string){
        GameBoard.canvas = <HTMLCanvasElement> document.getElementById(canvasId);
        GameBoard.canvasWidth = GameBoard.canvas.width;
        GameBoard.canvasHeight = GameBoard.canvas.height;
        GameBoard.context = GameBoard.canvas.getContext('2d');
        GameBoard.imageData = GameBoard.context.getImageData(0,0,GameBoard.canvasWidth,GameBoard.canvasHeight);
        GameBoard.buf = new ArrayBuffer(GameBoard.imageData.data.length);
        GameBoard.buf8 = new Uint8ClampedArray(GameBoard.buf);
        GameBoard.data = new Uint32Array(GameBoard.buf);
    }

    private _drawPixel(x: number, y: number, color: Color): void {       
        GameBoard.data[y * GameBoard.canvasWidth + x] =
            (color.alpha << 24) |    // alpha
            (color.blue << 16) |    // blue
            (color.green <<  8) |    // green
             color.red;            // red
    }

    private _drawCircle(x, y, r, color){
       
        let PI = 3.1415926535;
        let i, angle, x1, y1;

        for(i = 0; i < 360; i += 0.01)
        {
                angle = i;
                x1 = Math.round(r * Math.cos(angle * PI / 180));
                y1 =  Math.round(r * Math.sin(angle * PI / 180));
                this._drawLine(x,y,x + x1, y + y1, color);
        }

        let x0 = x;
        let y0 = y;
        x = r;
        y = 0;
        let decisionOver2 = 1 - x;   // Decision criterion divided by 2 evaluated at x=r, y=0

        while (x >= y) {
        
            this.drawLine(x + x0, y + y0, y + x0,x + y0, color);            
            this.drawLine(-x + x0, y + y0, -y + x0,x + y0, color);
            this.drawLine(-x + x0, -y + y0, -y + x0,-x + y0, color);
            this.drawLine(x + x0, -y + y0, y + x0,-x + y0, color);

            this._drawPixel(x + x0, y + y0, color);
            this._drawPixel(y + x0, x + y0, color);


            this._drawPixel(-x + x0, y + y0, color);
            this._drawPixel(-y + x0, x + y0, color);
                        
            this._drawPixel(-x + x0, -y + y0, color);
            this._drawPixel(-y + x0, -x + y0, color);
            
            
            this._drawPixel(x + x0, -y + y0, color);
            this._drawPixel(y + x0, -x + y0, color);
            y++;
            if (decisionOver2 <= 0) {
                decisionOver2 += 2 * y + 1; // Change in decision criterion for y -> y+1
            } else {
                x--;
                decisionOver2 += 2 * (y - x) + 1; // Change for y -> y+1, x -> x-1
            }
         }
    }

    private _drawLine(x0:number,y0:number, x1:number, y1:number, color:Color){
        let dx = Math.abs(x1-x0);
        let dy = Math.abs(y1-y0);
        let sx = (x0 < x1) ? 1 : -1;
        let sy = (y0 < y1) ? 1 : -1;
        let err = dx-dy;

        while(true){
            this._drawPixel(x0,y0,color);  // Do what you need to for this
            if ((x0==x1) && (y0==y1)) break;
            let e2 = 2*err;
            if (e2 >-dy){ err -= dy; x0  += sx; }
            if (e2 < dx){ err += dx; y0  += sy; }
        }
    }
    
    public drawLine(x0:number,y0:number, x1:number, y1:number, color:Color) {
        this._drawLine(x0,y0,x1,y1,color);
    }

    public drawCircle(x:number, y:number, radius:number, color:Color): void {
        this._drawCircle(x,y,radius,color);
    }

    public paint(): void {
        GameBoard.imageData.data.set(GameBoard.buf8);
        GameBoard.context.putImageData(GameBoard.imageData, 0, 0);
    }    

    public drawPixel(x: number, y: number, color: Color): void {
        this._drawPixel(x,y,color);
    }
}