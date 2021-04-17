let main = new Vue({
	el: '#main',
	data: {
    ctx: null,
    width: 160,
    height: 90,
    size: 10,
		cells: [],
    ms: 50,
    p: 0.6
	},
	methods: {
    update() {
      let time = Date.now()
      let changes = []

      h = this.cells.length
      for (let y = 0; y < h; y ++) {
        w = this.cells[y].length
        for (let x = 0; x < w; x ++) {
          let t = (y - 1 + h) % h, b = (y + 1) % h
          let l = (x - 1 + w) % w, r = (x + 1) % w
          let alive =
            this.cells[b][l] + this.cells[b][x] +
            this.cells[b][r] + this.cells[y][r] +
            this.cells[t][r] + this.cells[t][x] +
            this.cells[t][l] + this.cells[y][l]
          if (this.cells[y][x] && (alive > 3 || alive < 2))
            changes.push({ y, x, v: 0 })
          else if (!this.cells[y][x] && alive === 3)
            changes.push({ y, x, v: 1 })
        }
      }

      changes.forEach(o => {
        this.$set(this.cells[o.y], o.x, o.v)
        this.ctx.fillStyle = o.v ? 'white' : 'black'
        this.ctx.fillRect(o.x * this.size, o.y * this.size, this.size, this.size)
      })
      console.log(Date.now() - time)

      setTimeout(() => requestAnimationFrame(this.update), this.ms)
    }
	},
	mounted: function() {
    let canvas = document.querySelector('#main>canvas')
    scaleToWindow(canvas)
    window.addEventListener('resize', _ => { scaleToWindow(canvas) })
    this.ctx = canvas.getContext('2d')

    for (let y = 0; y < this.height; y++) {
      this.cells.push([])
      for (let x = 0; x < this.width; x++)
        this.cells[y].push(Math.random() < this.p ? 1 : 0)
    }

    h = this.cells.length
    for (let y = 0; y < h; y++) {
      w = this.cells[y].length
      for (let x = 0; x < w; x++) {
        this.ctx.fillStyle = this.cells[y][x] ? 'white' : 'black'
        this.ctx.fillRect(x * this.size, y * this.size, this.size, this.size)
      }
    }

    setTimeout(() => requestAnimationFrame(this.update), this.ms)
	}
})