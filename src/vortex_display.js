export class PanoVortexCanvas {
    constructor(container, videos = []) {
        this.container = container;
        this.videos = videos;
        this.mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, vx: 0, vy: 0 };
        this.init();
    }
    init() {
        this.canvas = document.createElement("canvas");
        this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
        if (!this.gl) {
            this.init2D();
            return;
        }
        this.resize();
        this.container.appendChild(this.canvas);
        window.addEventListener("resize", () => this.resize());
        window.addEventListener("mousemove", (e) => {
            const nx = e.clientX / window.innerWidth;
            const ny = 1.0 - (e.clientY / window.innerHeight);
            this.mouse.vx = nx - this.mouse.targetX;
            this.mouse.vy = ny - this.mouse.targetY;
            this.mouse.targetX = nx;
            this.mouse.targetY = ny;
        });
        this.setupShaders();
        this.setupBuffers();
        this.setupTextures();
        this.animate();
    }
    init2D() {
        this.ctx = this.canvas.getContext("2d");
        this.resize();
        this.container.appendChild(this.canvas);
        window.addEventListener("resize", () => this.resize());
        this.animate2D();
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (this.gl) {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    setupShaders() {
        const gl = this.gl;
        const vsSource = `
            attribute vec2 aPosition;
            varying vec2 vUv;
            void main() {
                vUv = (aPosition + 1.0) * 0.5;
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }
        `;
        const fsSource = `
            precision mediump float;
            varying vec2 vUv;
            uniform sampler2D uVideoTexture;
            uniform float uTime;
            uniform vec2 uMouse;
            uniform vec2 uMouseVel;
            void main() {
                vec2 p = vUv - uMouse;
                float r = length(p);
                float speed = 0.25 + length(uMouseVel) * 20.0;
                float theta = atan(p.y, p.x) + uTime * speed + (1.0 - r) * 5.0;
                
                vec2 uvR = vec2(r * cos(theta + 0.05), r * sin(theta + 0.05)) + uMouse;
                vec2 uvG = vec2(r * cos(theta), r * sin(theta)) + uMouse;
                vec2 uvB = vec2(r * cos(theta - 0.05), r * sin(theta - 0.05)) + uMouse;

                float red = texture2D(uVideoTexture, fract(uvR)).r;
                float green = texture2D(uVideoTexture, fract(uvG)).g;
                float blue = texture2D(uVideoTexture, fract(uvB)).b;
                vec3 videoColor = vec3(red, green, blue);

                vec3 voidBlack = vec3(0.02, 0.02, 0.02);
                vec3 peach = vec3(1.0, 0.85, 0.73);
                vec3 flamingo = vec3(0.99, 0.55, 0.67);
                vec3 cyan = vec3(0.0, 1.0, 1.0);

                vec3 brandTint = mix(peach, flamingo, 0.5 + 0.5 * sin(uTime * 1.5 + r * 15.0));
                brandTint = mix(brandTint, cyan, 0.5 + 0.5 * cos(uTime * 2.0 + r * 10.0));

                vec3 finalColor = mix(videoColor, brandTint, smoothstep(0.02, 0.4, r) * 0.65);
                finalColor = mix(finalColor, voidBlack, smoothstep(0.4, 0.6, r));

                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;
        const createShader = (type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        };
        const vs = createShader(gl.VERTEX_SHADER, vsSource);
        const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
        this.program = gl.createProgram();
        gl.attachShader(this.program, vs);
        gl.attachShader(this.program, fs);
        gl.linkProgram(this.program);
        gl.useProgram(this.program);
    }
    setupBuffers() {
        const gl = this.gl;
        const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        const aPositionLocation = gl.getAttribLocation(this.program, "aPosition");
        gl.enableVertexAttribArray(aPositionLocation);
        gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0);
    }
    setupTextures() {
        const gl = this.gl;
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }
    animate() {
        const gl = this.gl;
        let lastX = this.mouse.x;
        let lastY = this.mouse.y;

        const render = (time) => {
            requestAnimationFrame(render);
            this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.15;
            this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.15;
            this.mouse.vx = this.mouse.x - lastX;
            this.mouse.vy = this.mouse.y - lastY;
            lastX = this.mouse.x;
            lastY = this.mouse.y;

            gl.clearColor(0.04, 0.04, 0.04, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            if (this.videos.length > 0 && this.videos[0].readyState >= this.videos[0].HAVE_CURRENT_DATA) {
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.videos[0]);
            }

            const timeLocation = gl.getUniformLocation(this.program, "uTime");
            const mouseLocation = gl.getUniformLocation(this.program, "uMouse");
            const mouseVelLocation = gl.getUniformLocation(this.program, "uMouseVel");

            gl.uniform1f(timeLocation, time * 0.001);
            gl.uniform2f(mouseLocation, this.mouse.x, this.mouse.y);
            gl.uniform2f(mouseVelLocation, this.mouse.vx, this.mouse.vy);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        };
        requestAnimationFrame(render);
    }
    animate2D() {
        const render = () => {
            requestAnimationFrame(render);
            this.ctx.fillStyle = "#0A0A0A";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = "#FFDAB9";
            this.ctx.font = "22px monospace";
            this.ctx.fillText("KNOCKSSTUDiOS - 3D Vortex PanoCanvas", 40, 60);
        };
        requestAnimationFrame(render);
    }
}
