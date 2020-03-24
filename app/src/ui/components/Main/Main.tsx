import * as React from 'react'
import { Component } from 'react'
import io from 'socket.io-client'
import 'normalize.css'

import s from './style.scss'
import '../../../common.scss'
import { number } from 'prop-types';
import { MaxPQ } from '../../../algos/PQ'
import Ball from './ball/ball'

const heap = new MaxPQ<string>(11)

export interface Props { }

interface State {
  count: number;
}

function throttle(func, ms) {

  let isThrottled = false,
    savedArgs,
    savedThis;

  function wrapper() {

    if (isThrottled) { // (2)
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments); // (1)

    isThrottled = true;

    setTimeout(function () {
      isThrottled = false; // (3)
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}

function debounce(f, ms) {

  let isCooldown = false;

  return function () {
    if (isCooldown) return;

    f.apply(this, arguments);

    isCooldown = true;

    setTimeout(() => isCooldown = false, ms);
  };

}

export default class Main extends Component<Props, State> {

  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  canvasLayered: HTMLCanvasElement
  ctxLayered: CanvasRenderingContext2D
  resolution = {
    x: 30,
    y: 30
  }
  dimension = {
    x: 600,
    y: 600
  }
  step: {
    x: number,
    y: number,
  }

  saveCoord: {
    x: number,
    y: number,
  } = {
      x: -1,
      y: -1,
    }

  canvasClientRect: ClientRect | DOMRect

  radius = 0
  ball: Ball
  ball2: Ball
  constructor(props) {
    super(props)
    this.ball = new Ball({ m: 1, r: 5, rx: 31, ry: 31, vx: 0.2, vy: 0.04 })
    this.ball2 = new Ball({ m: 1, r: 5, rx: 21, ry: 21, vx: 0.1, vy: 0.08 })
    this.step = {
      x: this.dimension.x / this.resolution.x,
      y: this.dimension.y / this.resolution.y,
    }
  }

  componentDidMount() {
    // this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    // this.canvas.focus()
    // this.ctx = this.canvas.getContext('2d');
    // this.ctx.fillStyle = "gray";
    // this.ctx.fillRect(0, 0, 360, 360);

    this.canvasLayered = document.getElementById('canvasLayered') as HTMLCanvasElement;
    this.ctxLayered = this.canvasLayered.getContext('2d');
    this.ctxLayered.fillStyle = 'white'
    this.ctxLayered.fillRect(0, 0, this.dimension.x, this.dimension.y);
    this.setBall(this.ball.getCoordinates(), this.ball.getRadius())
    this.setBall(this.ball2.getCoordinates(), this.ball2.getRadius())
    const dt = 20
    setInterval(() => this.draw(dt), dt);
  }
  draw(dt: number) {
    this.ball.move(dt, this.canvasLayered.width, this.canvasLayered.height)
    this.ball2.move(dt, this.canvasLayered.width, this.canvasLayered.height)
    // console.log(this.ball)
    this.ctxLayered.clearRect(0, 0, this.canvasLayered.width, this.canvasLayered.height)
    this.setBall(this.ball.getCoordinates(), this.ball.getRadius())
    this.setBall(this.ball2.getCoordinates(), this.ball2.getRadius())
  }
  setBall(coordinates: { rx: number, ry: number }, radius: number) {
    this.ctxLayered.beginPath()
    this.ctxLayered.arc(coordinates.rx, coordinates.ry, radius, 0, 2 * Math.PI)
    this.ctxLayered.fillStyle = 'red'
    this.ctxLayered.strokeStyle = 'black'
    this.ctxLayered.fill()
    this.ctxLayered.stroke();
    this.ctxLayered.closePath()
  }

  moveKey = (evt: React.SyntheticEvent<HTMLCanvasElement, KeyboardEvent>) => {
    console.log('move')
  }
  render() {
    return (
      <div className={s.root}>
        {/* <canvas
          tabIndex={0}
          // onMouseMove={debounce(this.move, 60)}
          onKeyPress={this.moveKey}
          width="600" height="600" id="canvas"></canvas> */}
        <canvas width="600" height="600" className={s.canvasLayered} id="canvasLayered"></canvas>
      </div>
    )
  }
}
