// import { Math as JSMath } from "./bindings/dom";
import {mousePosX, mousePosY, mousePosSet} from "./helpers";
// Set up our memory
// By growing our Wasm Memory by 1 page (64KB)
memory.grow(10);

let canvasWidth: u32 = 500;
let canvasHeight: u32 = 500;
let numPoints: u32 = 0;
let propertiesPerPoint = 4;

let distanceFactor: f64 = 0.1;
let timeFactor: f64 = 2;


export function setCanvasSize(width: u32, height: u32): void {
  canvasWidth = width;
  canvasHeight = height;
}

// function getCanvasWidth(): u32 {
//   return load<u32>(0);
// }
// function getCanvasHeight(): u32 {
//   return load<u32>(4);
// }


export function getMemAt(index: u32): f64 {
  return load<f64>(index << 3);
}

export function storeMemAt(index: u32, val: f64): void {
  store<f64>(index << 3, val);
}

// export function getPointAt(index: u32) : Point

class Point {  
  static initialize(index: u32, x: f64, y: f64, velX: f64, velY: f64): void {
    Point.setX(index, x);
    Point.setY(index, y);
    Point.setVelX(index, velX);
    Point.setVelY(index, velY);
  }

  static x(index: u32): f64 {
    return getMemAt(index * propertiesPerPoint)
  }
  static setX(index: u32, x: f64): void {
    storeMemAt(index * propertiesPerPoint, x);
  }
  static y(index: u32): f64 {
    return getMemAt(index * propertiesPerPoint + 1);
  }
  static setY(index: u32, y: f64): void {
    storeMemAt(index * propertiesPerPoint + 1, y);
  }

  static velX(index: u32): f64 {
    return getMemAt(index * propertiesPerPoint + 2);
  }
  static setVelX(index: u32, velX: f64): void {
    storeMemAt(index * propertiesPerPoint + 2, velX);
  }

  static velY(index: u32): f64 {
    return getMemAt(index * propertiesPerPoint + 3);
  }
  static setVelY(index: u32, velY: f64): void {
    storeMemAt(index * propertiesPerPoint + 3, velY);
  }
}


class Vec2D {
  x: f64;
  y: f64;
  constructor(x: f64, y: f64) {
    this.x = x;
    this.y = y;
  }
}


const gravConstant: f64 = 100;
const gravityBreakdown: f64 = 15 * distanceFactor;

const GravReturnVector = new Vec2D(0 as f64, 0 as f64)

function gravityForces(p: u32): void {
  if(!mousePosSet) {
    GravReturnVector.x = 0;
    GravReturnVector.y = 0;
    return;
  }
  let deltaX = (Point.x(p) - mousePosX) * distanceFactor;
  let deltaY = (Point.y(p) - mousePosY) * distanceFactor;

  const signX = Math.sign(deltaX);
  const signY = Math.sign(deltaY);

  if(Math.abs(deltaX) < gravityBreakdown) {
    deltaX = gravityBreakdown * signX;
  }
  if(Math.abs(deltaY) < gravityBreakdown) {
    deltaY = gravityBreakdown * signY;
  }

  const distDist = deltaX * deltaX + deltaY * deltaY;
 
  const forceMagnitude = gravConstant / distDist;

  const theta = Math.atan(Math.abs(deltaY / deltaX));

  const gravX = Math.abs(Math.cos(theta) * forceMagnitude) * -signX;
  const gravY = Math.abs(Math.sin(theta) * forceMagnitude) * -signY;

  GravReturnVector.x = gravX;
  GravReturnVector.y = gravY;
  return;
}

function pointGravityForces(p: u32, p2: u32): void {
  let deltaX = (Point.x(p) - mousePosX) * distanceFactor;
  let deltaY = (Point.y(p) - mousePosY) * distanceFactor;

  const signX = Math.sign(deltaX);
  const signY = Math.sign(deltaY);

  if(Math.abs(deltaX) < gravityBreakdown) {
    deltaX = gravityBreakdown * signX;
  }
  if(Math.abs(deltaY) < gravityBreakdown) {
    deltaY = gravityBreakdown * signY;
  }

  const distDist = deltaX * deltaX + deltaY * deltaY;
 
  const forceMagnitude = gravConstant / distDist;

  const theta = Math.atan(Math.abs(deltaY / deltaX));

  const gravX = Math.abs(Math.cos(theta) * forceMagnitude) * -signX;
  const gravY = Math.abs(Math.sin(theta) * forceMagnitude) * -signY;

  GravReturnVector.x = gravX;
  GravReturnVector.y = gravY;
  return;
}


export function update(dtSeconds: f64): void {
  dtSeconds *= timeFactor;
  for(let p: u32 = 0; p < numPoints; p++) {
    // storeMemAt(p*2, (getMemAt(p*2) + p / 30.0) % canvasWidth );

    Point.setX(p, (Point.x(p) + Point.velX(p) * dtSeconds) % canvasWidth);
    Point.setY(p, (Point.y(p) + Point.velY(p) * dtSeconds) % canvasHeight);


    gravityForces(p);

    Point.setVelX(p, Point.velX(p) + GravReturnVector.x * dtSeconds * 100 );
    Point.setVelY(p, Point.velY(p) + GravReturnVector.y * dtSeconds * 100 );


    Point.setVelX(p, Point.velX(p) * 0.99);
    Point.setVelY(p, Point.velY(p) * 0.99);


  }
}

export function initialize(_numPoints: u32, spread: f64): void {
  numPoints = _numPoints;
  const halfWidth = canvasWidth / 2;
  const halfHeight = canvasHeight / 2;

  for(let i: u32 = 0; i < numPoints; i++) {
    Point.initialize(i, 
        halfWidth + (Math.random() - 0.5) * spread * 2,
        halfHeight + (Math.random() - 0.5) * spread * 2,
        (Math.random() - 0.5) * spread * 2,
        (Math.random() - 0.5) * spread * 2,
      )
    // storeMemAt(i*2, halfWidth + (Math.random() - 0.5) * spread * 2);
    // storeMemAt(i*2+1, halfHeight + (Math.random() - 0.5) * spread * 2);
  }
}
