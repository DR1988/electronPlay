import * as React from 'react'
import { Component } from 'react'
import io from 'socket.io-client'
import 'normalize.css'

import s from './style.scss'
import '../../../common.scss'
import { number } from 'prop-types';

const socket = io(`${location.origin}`)

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
    x: 20,
    y: 20
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
  constructor(props) {
    super(props)
    this.step = {
      x: this.dimension.x / this.resolution.x,
      y: this.dimension.y / this.resolution.y,
    }
  }

  componentDidMount() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.canvas.focus()
    this.ctx = this.canvas.getContext('2d');
    // this.ctx.fillStyle = "gray";
    // this.ctx.fillRect(0, 0, 360, 360);
    for (var i = 0; i < this.resolution.x; i++) {
      for (var j = 0; j < this.resolution.y; j++) {
        this.ctx.fillStyle = 'rgb(' + Math.floor(this.dimension.x - this.step.x * i) + ', ' +
          Math.floor(this.dimension.y - this.step.y * j) + ', 0)';
        this.ctx.fillRect(j * this.step.y, i * this.step.y, this.step.x, this.step.x);
      }
    }
    this.canvasLayered = document.getElementById('canvasLayered') as HTMLCanvasElement;
    this.ctxLayered = this.canvasLayered.getContext('2d');
    this.ctxLayered.fillStyle = 'black'
    this.ctxLayered.fillRect(0, 0, this.dimension.x, this.dimension.y);

    this.setToCenter()
  }

  setToCenter() {
    if (!this.canvasClientRect) {
      this.canvasClientRect = this.canvas.getBoundingClientRect()
    }

    for (var i = 0; i < this.resolution.x; i++) {
      for (var j = 0; j < this.resolution.y; j++) {
        this.ctxLayered.fillStyle = 'black'
        this.ctxLayered.fillRect(i * this.step.x, j * this.step.y, this.step.x, this.step.y);
        if (this.canvasClientRect.width / 2 >= i * this.step.x && this.canvasClientRect.width / 2 < (i + 1) * this.step.x
          && this.canvasClientRect.height / 2 >= j * this.step.y && this.canvasClientRect.height / 2 < (j + 1) * this.step.y) {
          this.saveCoord.x = i
          this.saveCoord.y = j
          this.ctxLayered.fillStyle = 'transparent'
          this.ctxLayered.clearRect(i * this.step.x, j * this.step.y, this.step.x, this.step.y)
          this.ctxLayered.fillRect(i * this.step.x, j * this.step.y, this.step.x, this.step.y);
        }
      }
    }
  }

  move = (evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { clientX, clientY } = evt
    if (!this.canvasClientRect) {
      this.canvasClientRect = evt.currentTarget.getBoundingClientRect()
    }
    // console.log(this.canvasClientRect)

    const offsetL = clientX - this.canvasClientRect.left
    const offsetH = clientY - this.canvasClientRect.top

    if (this.saveCoord.x !== Math.floor(offsetL / this.step.x) || this.saveCoord.y !== Math.floor(offsetH / this.step.y)) {
      this.saveCoord.x = Math.floor(offsetL / this.step.x)
      this.saveCoord.y = Math.floor(offsetH / this.step.y)
      // this.ctxLayered.clearRect(0, 0, this.dimension.x, this.dimension.y)
      for (var i = 0; i < this.resolution.x; i++) {
        for (var j = 0; j < this.resolution.y; j++) {
          this.ctxLayered.fillStyle = 'black'
          this.ctxLayered.fillRect(i * this.step.x, j * this.step.y, this.step.x, this.step.y);
          if (offsetL > i * this.step.x && offsetL < (i + 1) * this.step.x
            && offsetH > j * this.step.y && offsetH < (j + 1) * this.step.y) {
            this.ctxLayered.fillStyle = 'transparent'
            this.ctxLayered.clearRect(i * this.step.x, j * this.step.y, this.step.x, this.step.y)
            this.ctxLayered.fillRect(i * this.step.x, j * this.step.y, this.step.x, this.step.y);
          }
        }
      }
    }
  }

  moveKey = (evt: React.SyntheticEvent<HTMLCanvasElement, KeyboardEvent>) => {
    switch (evt.nativeEvent.key) {
      case 'w':
        console.log('up')
        for (var i = 0; i < this.resolution.x; i++) {
          for (var j = 0; j < this.resolution.y; j++) {
            this.ctxLayered.fillStyle = 'black'
            this.ctxLayered.fillRect(i * this.step.x, j * this.step.y, this.step.x, this.step.y);
            console.log(this.saveCoord.x, i - 1)
            if (this.saveCoord.x > i - 1 && this.saveCoord.x <= (i + 1)){
              // && this.saveCoord.y > j && this.saveCoord.y <= (j + 1)) {
              this.ctxLayered.fillStyle = 'transparent'
              this.saveCoord.x = i
              this.ctxLayered.clearRect(i * this.step.x, this.saveCoord.y * this.step.y, this.step.x, this.step.y)
              this.ctxLayered.fillRect(i * this.step.x, this.saveCoord.y * this.step.y, this.step.x, this.step.y);
            }
          }
        }
        break;
      case 's':
        console.log('down')
        for (var i = 0; i < this.resolution.x; i++) {
          for (var j = 0; j < this.resolution.y; j++) {
            this.ctxLayered.fillStyle = 'black'
            this.ctxLayered.fillRect(i * this.step.x, j * this.step.y, this.step.x, this.step.y);
            if (this.saveCoord.x > i - 1  && this.saveCoord.x + 1 < (i + 1)) {
              this.ctxLayered.fillStyle = 'transparent'
              this.saveCoord.x = i
              this.ctxLayered.clearRect(i * this.step.x, this.saveCoord.y * this.step.y, this.step.x, this.step.y)
              this.ctxLayered.fillRect(i * this.step.x, this.saveCoord.y * this.step.y, this.step.x, this.step.y);
            }
          }
        }
        break;
      case 'a':
        console.log('left')
        break;
      case 'd':
        console.log('right')
        break;
      default:
        break;
    }
  }
  render() {
    return (
      <div className={s.root}>
        <canvas
          tabIndex={0}
          // onMouseMove={debounce(this.move, 60)}
          onKeyPress={this.moveKey}
          width="600" height="600" id="canvas"></canvas>
        <canvas width="600" height="600" className={s.canvasLayered} id="canvasLayered"></canvas>
      </div>
    )
  }
}
