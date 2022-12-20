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
      abort: (args) => console.log("Abort!", args)
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

  window.canvas = new Canvas("canvas");
 
  new Animation();
};
runWasm();