import Primitive from 'typescript-dotnet-commonjs/System/Primitive'
import IComparable from 'typescript-dotnet-commonjs/System/IComparable'

export class MaxPQ<T extends Primitive> {
  private pq: T[]
  private N: number = 0

  constructor(capacity: number) {
    this.pq = new Array<T>(capacity + 1)
  }

  public isEmpty() {
    return this.N === 0
  }

  public insert(el: T) {
    this.pq[++this.N] = el
    this.swim(this.N)
  }

  private swim(k: number) {
    while (k > 1 && this.less(Math.floor(k / 2), k)) {
      this.exch(k, Math.floor(k / 2))
      k = Math.floor(k / 2)
    }
  }

  private sink(k: number) { 
    while(2*k <= this.N) {
      let j = 2*k
      if(j < this.N && this.less(j, j+1)){
        j++
      }
      if(!this.less(k, j)) break;
      this.exch(k, j)
      k = j
    }
  }

  delMax(): T {
    let max = this.pq[1]
    this.exch(1, this.N--)
    this.sink(1)
    this.pq[this.N+1] = null
    return max
  }

  delMin() :T {
    return this.pq[this.N]
  }

  private less(i: number, j: number): boolean {
    return this.pq[i] < this.pq[j]
  }

  private exch(i: number, j: number) {
    console.log(`exchanging ${this.pq[i]} with ${this.pq[j]}`)
    const t = this.pq[i];
    this.pq[i] = this.pq[j];
    this.pq[j] = t;
  }

  public show() {
    console.log(this.pq)
  }
}

export class MaxPQComp<T extends IComparable<T>> {
  private pq: T[]
  private N: number = 0

  constructor(capacity: number) {
    this.pq = new Array<T>(capacity + 1)
  }

  public isEmpty() {
    return this.N === 0
  }

  public insert(el: T) {
    this.pq[++this.N] = el
    this.swim(this.N)
  }

  private swim(k: number) {
    while (k > 1 && this.less(Math.floor(k / 2), k)) {
      this.exch(k, Math.floor(k / 2))
      k = Math.floor(k / 2)
    }
  }

  private sink(k: number) {
    while (2 * k <= this.N) {
      let j = 2 * k
      if (j < this.N && this.less(j, j + 1)) {
        j++
      }
      if (!this.less(k, j)) break;
      this.exch(k, j)
      k = j
    }
  }

  delMax(): T {
    let max = this.pq[1]
    this.exch(1, this.N--)
    this.sink(1)
    this.pq[this.N + 1] = null
    return max
  }

  private less(i: number, j: number): boolean {
    return this.pq[i].compareTo(this.pq[j]) < 0
  }

  private exch(i: number, j: number) {
    console.log(`exchanging ${this.pq[i]} with ${this.pq[j]}`)
    const t = this.pq[i];
    this.pq[i] = this.pq[j];
    this.pq[j] = t;
  }

  public show() {
    this.pq.forEach(el => console.log(el))
    // console.log(this.pq)
  }
}

export class MinPQ<T extends Primitive> {
  private pq: T[]
  private N: number = 0

  constructor(capacity: number) {
    this.pq = new Array<T>(capacity + 1)
  }

  public isEmpty() {
    return this.N === 0
  }

  public insert(el: T) {
    this.pq[++this.N] = el
    this.swim(this.N)
  }

  private swim(k: number) {
    while (k > 1 && this.greater(Math.floor(k / 2), k)) {
      this.exch(k, Math.floor(k / 2))
      k = Math.floor(k / 2)
    }
  }

  private sink(k: number) {
    while (2 * k <= this.N) {
      let j = 2 * k
      if (j < this.N && this.greater(j, j + 1)) {
        j++
      }
      if (!this.greater(k, j)) break;
      this.exch(k, j)
      k = j
    }
  }

  delMax(): T {
    let max = this.pq[1]
    this.exch(1, this.N--)
    this.sink(1)
    this.pq[this.N + 1] = null
    return max
  }

  delMin(): T {
    return this.pq[this.N]
  }

  private greater(i: number, j: number): boolean {
    return this.pq[i] > this.pq[j]
  }

  private exch(i: number, j: number) {
    console.log(`exchanging ${this.pq[i]} with ${this.pq[j]}`)
    const t = this.pq[i];
    this.pq[i] = this.pq[j];
    this.pq[j] = t;
  }

  public show() {
    console.log(this.pq)
  }
}

export class MinPqComp<T extends IComparable<T>> {
  private pq: T[]
  private N: number = 0

  constructor(capacity: number = 0) {
    this.pq = new Array<T>(capacity + 1)
  }

  public isEmpty() {
    return this.N === 0
  }
  public clear() {
    this.pq = new Array<T>(1)
    this.N = 0
  }

  public insert(el: T) {
    this.pq[++this.N] = el
    this.swim(this.N)
  }

  private swim(k: number) {
    while (k > 1 && this.greater(Math.floor(k / 2), k)) {
      this.exch(k, Math.floor(k / 2))
      k = Math.floor(k / 2)
    }
  }

  private sink(k: number) {
    while (2 * k <= this.N) {
      let j = 2 * k
      if (j < this.N && this.greater(j, j + 1)) {
        j++
      }
      if (!this.greater(k, j)) break;
      this.exch(k, j)
      k = j
    }
  }

  delMin(): T {
    let max = this.pq[1]
    this.exch(1, this.N--)
    this.sink(1)
    this.pq[this.N + 1] = null
    return max
  }

  private greater(i: number, j: number): boolean {
    return this.pq[i].compareTo(this.pq[j]) > 0
  }

  private exch(i: number, j: number) {
    // console.log(`exchanging ${JSON.stringify(this.pq[i])} with ${JSON.stringify(this.pq[j])}`)
    const t = this.pq[i];
    this.pq[i] = this.pq[j];
    this.pq[j] = t;
  }

  public show() {
    this.pq.forEach(el => console.log(el))
  }
}

// const heap = new MinPQ<string>(11)
// heap.insert('T')
// heap.insert('P')
// heap.insert('R')
// heap.insert('N')
// heap.insert('H')
// heap.insert('A')
// heap.insert('E')
// heap.insert('I')
// heap.insert('G')
// heap.insert('O')
// heap.insert('S')
// heap.show()