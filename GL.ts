
window.onload = (ev) => {
    (async () => { 
        var canvases:HTMLCollectionOf<HTMLCanvasElement> = 
        <HTMLCollectionOf<HTMLCanvasElement>> document.getElementsByClassName("candle_fire");
    
        var fires:Fire[] = []; 
    
        for(var i = 0; i < canvases.length; i++){
            fires.push(new Fire(canvases[i]));  
        }
    
        setInterval(() =>{
            fires.forEach((fire)=>{
                fire.Draw();
            })
        }, 100);  
    })();
}


class Fire{
    private canvas:HTMLCanvasElement;
    private gl:WebGLRenderingContext;

    private static vert:WebGLShader;
    private static frag:WebGLShader;
    private static prog:WebGLProgram;

    private static buffer:WebGLBuffer;

    private static Attribute_VertPos;
    private static Uniform_time;

    private static Get(url:string):string{
        var xmlHttp:XMLHttpRequest = new XMLHttpRequest();
        xmlHttp.open( "GET", url, false );
        xmlHttp.send( null );
        return xmlHttp.responseText;
    }

    constructor(canvas:HTMLCanvasElement) {
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl");

        Fire.InitShaders(this.gl);
        Fire.InitBuffers(this.gl);

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        

    }

    public Draw():void{
        this.gl.clearColor(0.019,0,0,1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(Fire.prog);
        var now:Date = new Date();
        var time:number = now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds()/1000;

        this.gl.uniform1f(Fire.Uniform_time, time);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, Fire.buffer);
        this.gl.enableVertexAttribArray(Fire.Attribute_VertPos);
        this.gl.vertexAttribPointer(Fire.Attribute_VertPos, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);


    }

    private static InitBuffers(gl:WebGLRenderingContext):void{
        if(Fire.buffer == undefined){
            Fire.buffer = gl.createBuffer();

            gl.bindBuffer(gl.ARRAY_BUFFER, Fire.buffer);

            var data:Float32Array = new Float32Array(
                [
                     1.0,   -1.0, 
                    -1.0,    1.0,
                     1.0,    1.0,
                     1.0,   -1.0,
                    -1.0,    1.0,
                    -1.0,   -1.0,
                ]);

            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);            
        }
    }

    private static InitShaders(gl:WebGLRenderingContext):void{
        if(Fire.vert == undefined){
            Fire.vert = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(Fire.vert, Fire.Get("vert.glsl"));
            gl.compileShader(Fire.vert);

            if(!gl.getShaderParameter(Fire.vert, gl.COMPILE_STATUS)){
                console.log("Vrtex shader:\n" + gl.getShaderInfoLog(Fire.vert));

                Fire.vert = undefined;
            }
        }
        
        if(Fire.frag == undefined){
            Fire.frag = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(Fire.frag, Fire.Get("frag.glsl"));
            gl.compileShader(Fire.frag);

            if(!gl.getShaderParameter(Fire.frag, gl.COMPILE_STATUS)){
                console.log("Fragment shader:\n" + gl.getShaderInfoLog(Fire.frag));

                Fire.frag = undefined;
            }
        }

        if(Fire.prog == undefined){
            if(Fire.vert == undefined){
                console.log("Shader program:\nVertex shader is not not compiled");
            }
            if(Fire.frag == undefined){
                console.log("Shader program:\nFragment shader is not not compiled");
            }
            if(Fire.vert == undefined || Fire.frag == undefined){
                return;
            }

            Fire.prog = gl.createProgram();
            gl.attachShader(Fire.prog, Fire.vert);
            gl.attachShader(Fire.prog, Fire.frag);
            gl.linkProgram(Fire.prog);

            if(!gl.getProgramParameter(Fire.prog, gl.LINK_STATUS)){
                console.log("Shader program:\n" + gl.getProgramInfoLog(Fire.prog));

                Fire.prog = undefined;
            }
            Fire.Attribute_VertPos = gl.getAttribLocation(Fire.prog, "VertPos");
            Fire.Uniform_time = gl.getUniformLocation(Fire.prog, "time");
        }
    }
}