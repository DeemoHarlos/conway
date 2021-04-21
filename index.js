let main = new Vue({
	el: '#main',
	data: {
    ctx: null,
    width: 240,
    height: 135,
    size: 8,
		cells: [],
    ms: 0,
    p: 0.06,
    weight: [[1, 1, 1], [1, 0, 1], [1, 1, 1]],
    threshold: [2, 3, 4],
    frames: 0,
    time: 0,
	},
	methods: {
    iter2d(arr, f) {
      let h = arr.length
      for (let y = 0; y < h; y++) {
        let w = arr[y].length
        for (let x = 0; x < w; x++)
          f(arr[y][x], y, x, h, w)
      }
    },
    init2dArray(arr, h, w, f) {
      arr.legnth = 0
      for (let y = 0; y < h; y++) {
        arr.push([])
        for (let x = 0; x < w; x++)
          arr[y].push(f(y, x))
      }
    },
    getIndex(i, l) {
      return (i % l + l) % l
    },
    update() {
      let changes = []
      let neighbor = this.getNeighborCount()
      this.iter2d(neighbor, (n, y, x) => {
        let v = this.cells[y][x]
        if (v && (n >= this.threshold[2] || n < this.threshold[0]))
          changes.push({ y, x, v: 0 })
        else if (!v && (n >= this.threshold[1] && n < this.threshold[2]))
          changes.push({ y, x, v: 1 })
      })
      this.drawCells(changes)
      this.logTPS()
      setTimeout(() => requestAnimationFrame(this.update), this.ms)
    },
    getNeighborCount(isBordered) {
      let neighbor = []
      this.init2dArray(neighbor, this.height, this.width, _ => 0)
      this.iter2d(this.cells, (v, y, x) => {
        if (!v) return
        this.iter2d(this.weight, (w, i, j, sy, sx) => {
          if (!w) return
          offsety = i - Math.floor(sy / 2)
          offsetx = j - Math.floor(sx / 2)
          ny = isBordered ? (y - offsety) : this.getIndex(y - offsety, this.height)
          nx = isBordered ? (x - offsetx) : this.getIndex(x - offsetx, this.width )
          if (neighbor[ny] && neighbor[ny][nx] !== undefined)
            neighbor[ny][nx] += w * v
        })
      })
      return neighbor
    },
    drawCells(changes) {
      changes.forEach(o => {
        this.$set(this.cells[o.y], o.x, o.v)
        this.ctx.fillStyle = o.v ? 'white' : 'black'
        this.ctx.fillRect(o.x * this.size, o.y * this.size, this.size, this.size)
      })
    },
    logTPS() {
      this.frames++
      if (this.frames % 30 === 0) {
        let now = Date.now()
        console.log(`TPS = ${(1000 / (now - this.time) * 30).toFixed(2)}`)
        this.time = now
      }
    }
	},
	mounted: function() {
    let canvas = document.querySelector('#main>canvas')
    scaleToWindow(canvas)
    window.addEventListener('resize', _ => { scaleToWindow(canvas) })
    this.ctx = canvas.getContext('2d')

    this.init2dArray(this.cells, this.height, this.width, _ =>
      Math.random() < this.p ? 1 : 0
    )
    this.iter2d(this.cells, (v, y, x) => {
      this.ctx.fillStyle = v ? 'white' : 'black'
      this.ctx.fillRect(x * this.size, y * this.size, this.size, this.size)
    })

    this.time = Date.now()
    setTimeout(() => requestAnimationFrame(this.update), this.ms)
	}
})