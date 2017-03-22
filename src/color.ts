export class Color {
    public hue: number;
    public saturation: number;
    public light: number;

    public red: number;
    public green: number;
    public blue: number;
    public alpha: number;

    constructor(hue: number, 
                saturation:number, 
                light:number,
                red?: number,
                green?: number,
                blue?: number){
        this.hue = hue;
        this.saturation = saturation;
        this.light = light;
        this.alpha = 255;
        this.red = red;
        this.green = green;
        this.blue = blue;

        if(!this.red || !this.green || !this.blue) {
            this.setRGB();
        }
    }

    setRGB(){
        let rgb = RGBFromHSL(this.hue, this.saturation, this.light);
        this.red = rgb.r;
        this.green = rgb.g;
        this.blue = rgb.b;
    }

    invert(){
        // This is effectively (α+180) mod 360 to move us to diametrically opposed color on the color wheel
        if(this.hue > 180) {
            this.hue - 180;
        } else {
            this.hue + 180;
        }   

        this.setRGB()
    }
}

export function RandomColor(hue?: number, saturation?:number, light?:number):Color {
    let h = hue || Math.floor(Math.random() * (360- 1) + 1);
    let s = saturation || Math.floor(Math.random() * (100 - 1) + 1);
    let l = light || Math.floor(Math.random() * (100 - 1) + 1);
    return new Color(h,s,l);
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 */
export function RGBFromHSL(hue?: number, saturation?:number, light?:number){
    let h = hue/360;
    let s = saturation/100;
    let l = light/100;
    
    let r, g, b;
    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        let hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return (p + (q - p) * 6 * t);
            if(t < 1/2) return q;
            if(t < 2/3) return (p + (q - p) * (2/3 - t) * 6);
            return p;
        }

        let q = l < 0.5 ? l * (1 + s) : (l + (s - (l * s)));
        let p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    }
}

export function ColorFromRGB(red:number, green:number, blue:number): Color {
    let hsl = HSLFromRGB(red,green,blue);
    return new Color(hsl.h,hsl.s,hsl.l,red,green,blue);
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 */
function HSLFromRGB(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: h * 360, 
        s: s * 100,
        l: l * 100
    };
}