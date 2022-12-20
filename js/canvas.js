const debounce = function(func, wait, immediate) {
    var timeout;
    return () => {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

export default class Canvas {
	constructor(id) {
		this.el = document.getElementById(id);

		window.addEventListener('resize', debounce(()=>{this.resize()}, 40, false), false);

		this.resize();


		window.mousePos = {};

		document.body.addEventListener("mousemove", (event) => {
			mousePos.x = event.clientX;
			mousePos.y = event.clientY;


			if(event.clientX < 0  || event.clientX > canvas.width || event.clientY < 0 || event.clientY > canvas.height) {
				wasm.exports.unsetMousePos()
			}
			else {
				wasm.exports.setMousePos(mousePos.x, mousePos.y)
			}
		});

		const onTouch = (touchEvent) => {
			if(touchEvent.touches.length == 0) {
				console.log("no touch")
				mousePos.x = undefined;
				mousePos.y = undefined;
				wasm.exports.unsetMousePos()
				return;
			}
			var touch = touchEvent.touches[0];// || touchEvent.changedTouches[0];
			mousePos.x = touch.clientX;
			mousePos.y = touch.clientY;
			console.log("touch")
			wasm.exports.setMousePos(mousePos.x, mousePos.y)

		}
		document.addEventListener("touchmove", onTouch);
		document.addEventListener("touchstart", onTouch);
		document.addEventListener("touchend", onTouch);


		this.ctx = this.el.getContext("2d");


		this.el.style.display = "block";


		this.ctx.fillStyle = "white";
		this.ctx.clearRect(0,0, this.width, this.height);

	}
	resize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.el.width = this.width;
		this.el.height = this.height;

		if(window.wasm.exports) {
			window.wasm.exports.setCanvasSize(this.width,this.height)
		}
	}
}