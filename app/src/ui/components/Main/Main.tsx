import * as React from 'react'
import { Component } from 'react'
import io from 'socket.io-client'
import 'normalize.css'

import s from './style.scss'
import '../../../common.scss'
import { number } from 'prop-types';
import { MaxPQ, MinPqComp } from '../../../algos/PQ'
import Ball, { Event } from './ball/ball'
import BallsArray from './ball/ballsArray'

// const heap = new MaxPQ<string>(11)

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
  balls: Ball[];
  pq: MinPqComp<Event>
  t: number = 0
  HZ: number = 0.5
  constructor(props) {
    super(props)
    this.ball = new Ball({ m: 1, r: 5, rx: 31, ry: 31, vx: 0.2, vy: 0.04 })
    this.ball2 = new Ball({ m: 1, r: 5, rx: 21, ry: 21, vx: 0.1, vy: 0.08 })
    this.balls = BallsArray
    this.step = {
      x: this.dimension.x / this.resolution.x,
      y: this.dimension.y / this.resolution.y,
    }
    this.pq = new MinPqComp<Event>()

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
    this.setBalls(this.balls)
    // this.setBall(this.ball.getCoordinates(), this.ball.getRadius())
    // this.setBall(this.ball2.getCoordinates(), this.ball2.getRadius())
    const dt = 20
    // setInterval(() => this.draw(dt), dt);
    for (let i = 0; i < this.balls.length; i++) {
      this.initPredict(this.balls[i]);
    }
    let count = 0
    this.pq.insert(new Event(0, null, null));
    // this.pq.show()
    setTimeout(() => {
      // const event = this.pq.delMin()
      // // console.log('event', event)
      // // console.log(!event.isValid())
      // const a = event.a;
      // const b = event.b;
      // let currentDt
      // for (let i = 0; i < this.balls.length; i++) {
      //   currentDt = event.time - this.t
      //   this.balls[i].move(currentDt);
      //   console.log('currentDt', currentDt)
      // }
      // this.t = event.time;
      // if (a != null && b != null) {
      //   console.log('bounceOff')
      //   a.bounceOff(b);
      //   this.draw()
      // }
      // else if (a != null && b == null) {
      //   console.log('bounceOffVerticalWall')
      //   a.bounceOffVerticalWall()
      //   this.draw()
      // }
      // else if (a == null && b != null) {
      //   console.log('bounceOffHorizontalWall')
      //   b.bounceOffHorizontalWall()
      //   this.draw()
      // }
      // else if (a == null && b == null) {
      //   console.log('draw')
      //   this.draw()
      // }
      // this.predict(a);
      // this.predict(b);
    }, 1000);

    // while (!this.pq.isEmpty()) {
    //   const event = this.pq.delMin();
    //   if (!event.isValid()) continue;
    //   const a = event.a;
    //   const b = event.b;

    //   for (let i = 0; i < this.balls.length; i++) {
    //     this.balls[i].move(event.time - this.t);
    //   }
    //   this.t = event.time;

    //   if (a != null && b != null) a.bounceOff(b);
    //   else if (a != null && b == null) a.bounceOffVerticalWall()
    //   else if (a == null && b != null) b.bounceOffHorizontalWall();
    //   else if (a == null && b == null) this.draw(dt);
    //   this.predict(a);
    //   this.predict(b);
    // }
  }

  draw(dt: number = 20) {
    // this.balls.forEach(b => b.move(dt, this.canvasLayered.width, this.canvasLayered.height))
    // this.ball.move(dt, this.canvasLayered.width, this.canvasLayered.height)
    // this.ball2.move(dt, this.canvasLayered.width, this.canvasLayered.height)
    // console.log(this.ball)
    this.ctxLayered.clearRect(0, 0, this.canvasLayered.width, this.canvasLayered.height)
    this.setBalls(this.balls)
    // this.setBall(this.ball.getCoordinates(), this.ball.getRadius())
    // this.setBall(this.ball2.getCoordinates(), this.ball2.getRadius())
    this.pq.insert(new Event(this.t + 1.0 / this.HZ, null, null));
  }

  setBall(ball: Ball /*coordinates: { rx: number, ry: number }, radius: number*/) {
    this.ctxLayered.beginPath()
    this.ctxLayered.arc(ball.getCoordinates().rx, ball.getCoordinates().ry, ball.getRadius(), 0, 2 * Math.PI)
    this.ctxLayered.fillStyle = ball.getColor()
    this.ctxLayered.strokeStyle = 'black'
    this.ctxLayered.fill()
    this.ctxLayered.stroke();
    this.ctxLayered.closePath()
  }

  setBalls(ballList: Ball[]) {
    ballList.forEach(b => {
      this.setBall(b)
    })
  }

  private initPredict(a: Ball) {
    if (a == null) return;
    for (let i = 0; i < this.balls.length; i++) {
      const dt = a.timeToHit(this.balls[i]);
      this.pq.insert(new Event(this.t + dt, a, this.balls[i]));
    }
    this.pq.insert(new Event(this.t + a.timeToHitVerticalWall(this.canvasLayered.width), a, null));
    this.pq.insert(new Event(this.t + a.timeToHitHorizontalWall(this.canvasLayered.height), null, a));
  }

  private predict(a: Ball) {
    if (a == null) return;
    // this.pq.clear()
    for (let i = 0; i < this.balls.length; i++) {
      const dt = a.timeToHit(this.balls[i]);
      console.log('dt', dt)
      this.pq.insert(new Event(this.t + dt, a, this.balls[i]));
    }
    console.log('timeToHitVerticalWall', a.timeToHitVerticalWall(this.canvasLayered.width))
    this.pq.insert(new Event(this.t + a.timeToHitVerticalWall(this.canvasLayered.width), a, null));
    this.pq.insert(new Event(this.t + a.timeToHitHorizontalWall(this.canvasLayered.height), null, a));
  }

  moveKey = (evt: React.SyntheticEvent<HTMLCanvasElement, KeyboardEvent>) => {
    console.log('move')
  }

  delay = (time: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, time);
    })
  }
  stopSignal: boolean = false
  moveNext = async () => {
    this.stopSignal = false
    while (!this.pq.isEmpty() && !this.stopSignal) {
      await this.delay(10)
      console.log('-----------')
      console.log(this.pq)
      const event = this.pq.delMin()
      console.log('event', event)
      console.log(!event.isValid())
      const a = event.a;
      const b = event.b;
      let currentDt
      for (let i = 0; i < this.balls.length; i++) {
        currentDt = event.time - this.t
        this.balls[i].move(currentDt);
        console.log('currentDt', currentDt)
      }
      this.t = event.time;
      if (a != null && b != null) {
        console.log('bounceOff')
        a.bounceOff(b);
        // this.draw()
      }
      else if (a != null && b == null) {
        console.log('bounceOffVerticalWall')
        a.bounceOffVerticalWall()
        // this.draw()
      }
      else if (a == null && b != null) {
        console.log('bounceOffHorizontalWall')
        b.bounceOffHorizontalWall()
        // this.draw()
      }
      else if (a == null && b == null) {
        console.log('draw')
        this.draw()
      }
      this.predict(a);
      this.predict(b);
    }
  }

  stop = () => {
    this.stopSignal = true
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
        <button className={s.next} onClick={this.moveNext}>next</button>
        <button className={s.stop} onClick={this.stop}>stop</button>
      </div>
    )
  }
}
