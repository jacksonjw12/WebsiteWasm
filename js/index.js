import Canvas from "./canvas.js";
import Animation from "./animation.js";
const wasmBrowserInstantiate = async (wasmModuleUrl, importObject) => {
  let response = undefined;

  if (!importObject) {
    importObject = {
      env: {
        abort: (args) => console.log("Abort!", args)
      }
    };
  }

  if (WebAssembly.instantiateStreaming) {
    response = await WebAssembly.instantiateStreaming(
      fetch(wasmModuleUrl),
      importObject
    );
  } else {
    const fetchAndInstantiateTask = async () => {
      const wasmArrayBuffer = await fetch(wasmModuleUrl).then(response =>
        response.arrayBuffer()
      );
      return WebAssembly.instantiate(wasmArrayBuffer, importObject);
    };
    response = await fetchAndInstantiateTask();
  }

  return response;
};


const runWasm = async () => {

  const importObject = {
    JSMath: Math,
    env: {
      seed() {
        // ~lib/builtins/seed() => f64
        return (() => {
          // @external.js
          return Date.now() * Math.random();
        })();
      },
      abort: (args) => console.log("Abort!", args),
      "Math.random": (
        // ~lib/bindings/dom/Math.random() => f64
        Math.random
      ),
      "Math.mod": (
        (a,b)=>a % b
      ),
    },
    
  }


  // Instantiate our wasm module
  const wasmModule = await wasmBrowserInstantiate("../build/release.wasm", importObject);

  // Get our exports object, with all of our exported Wasm Properties
  const wasmExports = wasmModule.instance.exports;

  // Get our memory object from the exports
  const memory = wasmExports.memory;

  window.wasm = {
    memoryBuffer: new Float64Array(memory.buffer),
    exports: wasmExports
  }

  // window.wasmByteMemoryArray = 

  window.canvas = new Canvas("canvas");
 
  // Clear the canvas
  // canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
  // console.log(wasmByteMemoryArray);
  // wasmByteMemoryArray[0] = 1;
  // wasmByteMemoryArray[1] = 102.21;
  // wasmByteMemoryArray[2] = 5;
  


  // window.wasmExports = wasmExports;

  new Animation();
};
runWasm();