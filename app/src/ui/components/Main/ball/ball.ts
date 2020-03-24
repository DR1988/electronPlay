import * as React from 'react'
import IComparable from 'typescript-dotnet-commonjs/System/IComparable'

export default class Particle {
  private rx: number
  private ry: number
  private vx: number
  private vy: number
  private radius: number
  private mass: number
  private count: number
  constructor({ rx, ry, vx, vy, r, m }:
    { rx: number, ry: number, vx: number, vy: number, r: number, m: number }) {
    this.rx = rx
    this.ry = ry
    this.vx = vx
    this.vy = vy
    this.radius = r
    this.mass = m
  }
  public move(dt: number, width = 1, height = 1) {
    if ((this.rx + this.vx * dt < this.radius) || (this.rx + this.vx * dt > width - this.radius)) { this.vx = -this.vx; }
    if ((this.ry + this.vy * dt < this.radius) || (this.ry + this.vy * dt > height - this.radius)) { this.vy = -this.vy; }
    this.rx = this.rx + this.vx * dt;
    this.ry = this.ry + this.vy * dt
  }
  public timeToHit(that: Particle): number {
    if (this == that) return Infinity;
    const dx = that.rx - this.rx
    const dy = that.ry - this.ry;
    const dvx = that.vx - this.vx;
    const dvy = that.vy - this.vy;
    const dvdr = dx * dvx + dy * dvy;
    if (dvdr > 0) return Infinity;
    const dvdv = dvx * dvx + dvy * dvy;
    const drdr = dx * dx + dy * dy;
    const sigma = this.radius + that.radius;
    const d = (dvdr * dvdr) - dvdv * (drdr - sigma * sigma);
    if (d < 0) return Infinity;
    return -(dvdr + Math.sqrt(d)) / dvdv;
  }
  public timeToHitVerticalWall(): number {
    return 1
  }
  public timeToHitHorizontalWall(): number {
    return 1
  }

  public getCoordinates() {
    return {
      rx: this.rx,
      ry: this.ry
    }
  }

  public getRadius() {
    return this.radius
  }

  public bounceOff(that: Particle) {
    const dx = that.rx - this.rx
    const dy = that.ry - this.ry;
    const dvx = that.vx - this.vx
    const dvy = that.vy - this.vy;
    const dvdr = dx * dvx + dy * dvy;
    const dist = this.radius + that.radius;
    const J = 2 * this.mass * that.mass * dvdr / ((this.mass + that.mass) * dist);
    const Jx = J * dx / dist;
    const Jy = J * dy / dist;
    this.vx += Jx / this.mass;
    this.vy += Jy / this.mass;
    that.vx -= Jx / that.mass;
    that.vy -= Jy / that.mass;
    this.count++;
    that.count++;
  }
  public bounceOffVerticalWall() { }
  public bounceOffHorizontalWall() { }
}

export class Event implements IComparable<Event> {
  private time: number // time of event
  private a: Particle
  private b: Particle // particles involved in event
  private countA: number
  private countB: number; // collision counts for a and b

  public Event(t: number, a: Particle, b: Particle) {
    this.time = t
    this.a = a
    this.b = b
   }

  public compareTo(that: Event): number { return this.time - that.time; }

  public isValid(): boolean {
    return true
  }
}