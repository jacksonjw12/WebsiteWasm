// import { add, init, getAnimationState } from "../build/release.js";
// import { instantiate } from "../build/release.js"

import Canvas from "./canvas.js";
const numPoints = 100;

let w = 0;

// function tick(millis) {


// 	canvas.ctx.fillStyle="white";

// 	canvas.ctx.fillRect(0,0,canvas.width,canvas.height);

// 	canvas.ctx.fillStyle = "black";
// 	for(let p = 0; p < numPoints; p ++) {
// 		canvas.ctx.fillRect(pointVals[p*2], pointVals[p*2 + 1], 50, 50);
// 	}

// 	w+= 15;
// 	w = w % window.canvas.width;

// 	// wasmExports.update(w);

// 	window.requestAnimationFrame(tick);
// }

function init(wasmExports, memory) {
	const spreadAmplitude = 300;

	
	for (let i = 0; i < numPoints * 2; i+=2) {
		pointVals[i] = window.canvas.width / 2 + spreadAmplitude * 2 * (Math.random() - 0.5);
		pointVals[i+1] = window.canvas.height / 2 + spreadAmplitude * 2 * (Math.random() - 0.5);
	}

	tick();

}


window.onload = (async function() {

	window.canvas = new Canvas("canvas");
	// window.animationState = new AnimationState(10);

	
	
	const numInts = numPoints * 2;

	// const memory = new WebAssembly.Memory({ initial: ((byteSize + 0xffff) & ~0xffff) >>> 16 });

	const memory = new WebAssembly.Memory({
		initial: 10,
		maximum: 100,
		// shared: true
	});

	// const wasmexports = await instantiate(await compile(), {
	//   env: {
	//     memory
	//   }
	// })

	// const importObject = {
	//   env: {
	//     memory,
	//     table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' })
	//   },
	//   module: {
	//     numPoints: 100
	//   },
	//   Math
	// };
	const importObject = {
        env: {
            abort(_msg, _file, line, column) {
                console.error("abort called at index.ts:" + line + ":" + column);
            }
        }
    };

	const module2 = await WebAssembly.instantiateStreaming(
        fetch('../build/release.wasm'),
        importObject
    );

	// instantiate(fetch('../build/release.wasm'), importObject).then(({ exports }) => {
	// 	console.log("exports: ", exports);

	// 	window.pointVals = new Float64Array(memory.buffer);
	// 	window.wasmExports = exports;

	// 	// init(exports);

	// });

	// tick();
})()
console.log(0)
// document.body.innerText = add(1, 2);