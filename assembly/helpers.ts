export let mousePosX: f64 = 0;
export let mousePosY: f64 = 0
export let mousePosSet: boolean = false;
export function setMousePos(x: f64, y: f64): void {
	mousePosX = x;
	mousePosY = y;
	mousePosSet = true;
}

export function unsetMousePos(): void {
	mousePosSet = false;
}