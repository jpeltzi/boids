import {IRenderer} from "./renderer";
import {Flock} from "./flock";
import {Vector} from "./vector";

export class SvgRenderer implements IRenderer {
    private static readonly svgNS = "http://www.w3.org/2000/svg";
    private static readonly xlinkNS = "http://www.w3.org/1999/xlink";
    readonly width: number;
    readonly height: number;
    readonly ctx: SVGElement;

    constructor(flock: Flock, symbol: Vector[]) {
        this.ctx = document.createElementNS(SvgRenderer.svgNS, "svg");
        this.ctx.setAttribute("viewBox"
            , "0 0 " + String(flock.width) + " " + String(flock.height));
        this.ctx.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

        let $defs = document.createElementNS(SvgRenderer.svgNS, "defs");
        let $boid = document.createElementNS(SvgRenderer.svgNS, "g");
        let $ymbol = document.createElementNS(SvgRenderer.svgNS, "polyline");

        $boid.setAttribute("id", "boid");
        let path: string = "";
        for (let point of symbol) {
            path += `${point.x},${point.y} `;
        }
        $ymbol.setAttribute("points", path);

        $boid.appendChild($ymbol);
        $defs.appendChild($boid);
        this.ctx.appendChild($defs);

        let $rendererText = document.createElementNS(SvgRenderer.svgNS, "text");
        $rendererText.textContent = "<svg>";
        $rendererText.setAttribute("x", "5");
        $rendererText.setAttribute("y", "15");
        $rendererText.setAttribute("fill", "green");

        let $helpText = document.createElementNS(SvgRenderer.svgNS, "text");
        $helpText.textContent = "press tab to toggle";
        $helpText.setAttribute("x", "5");
        $helpText.setAttribute("y", "30");
        $helpText.setAttribute("fill", "grey");


        this.ctx.appendChild($rendererText);
        this.ctx.appendChild($helpText);

        document.body.appendChild(this.ctx);

        for (let boid of flock.boids) {
            let $boid = document.createElementNS(SvgRenderer.svgNS, "g");
            let $use = document.createElementNS(SvgRenderer.svgNS, "use");
            $boid.setAttribute("transform", `translate(${String(boid.location.x)} ${String(boid.location.y)})`);
            $use.setAttribute("transform", `rotate(${boid.orientation * 180 / Math.PI})`);
            $boid.appendChild($use);
            this.ctx.appendChild($boid);
            $use.setAttributeNS(SvgRenderer.xlinkNS, "href", "#boid");
            boid.element = $boid;
        }
    }

    draw(flock: Flock): void {
        for (let boid of flock.boids) {
            boid.element.setAttribute("transform"
                , `translate(${String(boid.location.x)} ${String(boid.location.y)})`);
            let $use = boid.element.firstElementChild;
            $use.setAttribute("transform", "rotate(" + (boid.orientation * 180 / Math.PI) + ")")
        }
    }

    clear() {
        this.ctx.remove();
    }
}