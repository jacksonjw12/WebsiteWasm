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
		window.numPoints = 5000;
		window.wasm.exports.initialize(numPoints, 200.0);


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
		canvas.ctx.fillStyle = `rgba(255,255,255,0.1)`

		canvas.ctx.fillRect(0,0,canvas.width,canvas.height);
		// canvas.ctx.fillRect(Animation.z % canvas.width,0,100,100);

		canvas.ctx.fillStyle = "black";
		const radius = 15;
		for(let p = 0; p < window.numPoints; p++) {
			canvas.ctx.beginPath();

			canvas.ctx.arc(wasm.memoryBuffer[p*numPropertiesPerPoint], wasm.memoryBuffer[p*numPropertiesPerPoint + 1], 10, 0, radius);
			canvas.ctx.fill();
		}
		

	}



}