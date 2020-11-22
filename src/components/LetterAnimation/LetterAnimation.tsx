import './LetterAnimation.css';
import React, { useEffect } from 'react';
import {
    LETTER_ANIMATION_LETTER_COUNT,
    LETTER_ANIMATION_REDRAW_SPEED,
    STANDARD_ALPHABET,
} from '../../constants/game.constant';
import { AppTheme, AppThemes } from '../../constants/themes.constant';
import { getRandomLetters } from '../../utils/game.utils';

// Thanks to Georgi Nikoloff for the great animation source code: https://codepen.io/gbnikolov/pen/jEqQdG
// I rewrote the code in Typescript, refactored it a bit and adapted it to the needs of this application.

class Particle {
    private radius = 3.5;

    constructor(
        public x: number,
        public y: number
    ) { }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.radius, this.radius);
        ctx.restore();
    }
}

class ParticleAlphabet {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private currentPos: number;
    private width: number;
    private height: number;
    private particlePositions: any[];
    private particles: Particle[];
    private tmpCanvas: HTMLCanvasElement;
    private tmpCtx: CanvasRenderingContext2D;
    private time: string;
    private counter = 0;
    private myInterval: any;
    private activeTheme: AppTheme;

    constructor(
        public letters: string[],
        public callbackWhenAnimationDone: () => void
    ) {
        this.canvas = document.querySelector('#letter-animation-canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        const mainElement = document.querySelector('main') as HTMLElement;
        this.activeTheme = AppThemes.find(theme => mainElement.classList.contains(theme.className)) as AppTheme;
        this.width = mainElement.offsetWidth;
        this.height = mainElement.offsetHeight;
        this.particlePositions = [];
        this.particles = [];
        this.tmpCanvas = document.createElement('canvas');
        this.tmpCtx = this.tmpCanvas.getContext('2d') as CanvasRenderingContext2D;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.particlePositions = [];
        this.currentPos = 0;
        this.time = '';
    }

    public init() {
        this.myInterval = setInterval(() => {
            if (this.counter < this.letters.length) {
                this.changeLetter();
                this.getPixels(this.tmpCanvas, this.tmpCtx);
            }
            this.counter++;
            if (this.counter > this.letters.length + 1) {
                clearInterval(this.myInterval);
                this.callbackWhenAnimationDone();
            }
        }, LETTER_ANIMATION_REDRAW_SPEED);

        this.makeParticles(1000);
        this.animate();
    }

    private changeLetter() {
        this.time = this.letters[this.currentPos];
        this.currentPos++;
        if (this.currentPos >= this.letters.length) {
            this.currentPos = 0;
        }
    }

    private makeParticles(num: number) {
        for (let i = 0; i <= num; i++) {
            const x = this.width / 2 + Math.random() * 400 - 200;
            const y = this.height / 2 + Math.random() * 400 - 200;
            this.particles.push(new Particle(x, y));
        }
    }

    private getPixels(canvas: any, ctx: any) {
        const keyword = this.time,
            gridX = 6,
            gridY = 6;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.fillStyle = 'red';
        ctx.font = 'italic bold 330px Noto Serif';
        ctx.fillText(keyword, canvas.width / 2 - ctx.measureText(keyword).width / 2, canvas.height / 2 + 100);
        const idata = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const buffer32 = new Uint32Array(idata.data.buffer);
        if (this.particlePositions.length > 0) this.particlePositions = [];
        for (let y = 0; y < canvas.height; y += gridY) {
            for (let x = 0; x < canvas.width; x += gridX) {
                if (buffer32[y * canvas.width + x]) {
                    this.particlePositions.push({ x: x, y: y });
                }
            }
        }
    }

    private animateParticles() {
        let p, pPos;
        for (let i = 0, num = this.particles.length; i < num; i++) {
            p = this.particles[i];
            pPos = this.particlePositions[i];
            if (this.particles.indexOf(p) === this.particlePositions.indexOf(pPos)) {
                p.x += (pPos.x - p.x) * .3;
                p.y += (pPos.y - p.y) * .3;
                p.draw(this.ctx);
            }
        }
    }

    private animate = () => {
        requestAnimationFrame(this.animate);
        this.ctx.fillStyle = this.activeTheme.animationBackgroundColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.animateParticles();
    }
}

interface LetterAnimationProps {
    letterToUnveil: string;
    callbackWhenAnimationDone: () => void;
}
export const LetterAnimation: React.FunctionComponent<LetterAnimationProps> = props => {
    const lettersToUse = [...STANDARD_ALPHABET].filter(letter => letter !== props.letterToUnveil);
    const lettersForAnimation = [...getRandomLetters(LETTER_ANIMATION_LETTER_COUNT - 1, lettersToUse), props.letterToUnveil];
    useEffect(() => {
        const particleAlphabet = new ParticleAlphabet(lettersForAnimation, props.callbackWhenAnimationDone);
        particleAlphabet.init();
    });
    return (
        <canvas id="letter-animation-canvas"></canvas>
    );
};
