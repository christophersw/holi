export class Color {
    public red: number;
    public green: number;
    public blue: number;
    public alpha: number;

    constructor(r: number, g:number, b:number, a:number){
        this.red = r;
        this.blue = b;
        this.green = g;
        this.alpha = a;
    }
}

export function RandomColor(red?: number, green?:number, blue?:number, alpha?:number):Color {
    let a = alpha || Math.floor(Math.random() * (256 - 1) + 1);
    let r = red || Math.floor(Math.random() * (256 - 1) + 1);
    let g = green || Math.floor(Math.random() * (256 - 1) + 1);
    let b = blue || Math.floor(Math.random() * (256 - 1) + 1);
    
    return new Color(r,g,b,a);
}