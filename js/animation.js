import WasmUtil from './wasmUtil.js';

const numPropertiesPerPoint = 4;

export default class Animation {
	constructor(wasmExports) {
		if(window.canvas === undefined || window.wasm === undefined) {
			throw "needs a canvas and wasmExports";
		}


		Animation.init();
		Animation.started = true;

		window.requestAnimationFrame(Animation.tick);

	}

	static init() {
		window.numPoints = 700;
		window.wasm.exports.initialize(numPoints, 500.0);


	}

	static tick(timeMillis) {
		if(!Animation.lastTimeMillis) {
			Animation.lastTimeMillis = timeMillis;
		}

		const dt = timeMillis - Animation.lastTimeMillis;

		Animation.update(dt);

		Animation.render();


		Animation.lastTimeMillis = timeMillis;
		window.requestAnimationFrame(Animation.tick);

	}

	static update(dtMillis) {
		const dtSeconds = dtMillis / 1000.0
		// console.log(dtSeconds);
		window.wasm.exports.update(dtSeconds);
	}

	static render() {

		// canvas.ctx.fillStyle = "white";
		canvas.ctx.fillStyle = `rgba(255,255,255,1.0)`

		canvas.ctx.fillRect(0,0,canvas.width,canvas.height);
		// canvas.ctx.fillRect(Animation.z % canvas.width,0,100,100);

		canvas.ctx.fillStyle = "black";
		canvas.ctx.strokeStyle = "rgba(255,255,255,0.9)";

		const radius = 10;
		for(let p = 0; p < window.numPoints; p++) {
			const size = 10 * (p / window.numPoints);

			canvas.ctx.beginPath();

			const x = wasm.memoryBuffer[p*numPropertiesPerPoint];
			const y = wasm.memoryBuffer[p*numPropertiesPerPoint + 1];

			canvas.ctx.arc(x, y, radius+size, 0, 2*Math.PI);
			canvas.ctx.fill();


			
			canvas.ctx.stroke();
		}

		

	}



}