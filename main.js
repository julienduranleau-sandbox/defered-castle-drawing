const sketch = new p5(p5 => {
    const drawCalls = []
    const PERSPECTIVE = 2
    let drawCallIndex = 0

    p5.setup = () => {
        p5.createCanvas(1024, 1024)

        tower({ x: 100, y: 200 }, 50, 100)
        tower({ x: 400, y: 200 }, 50, 100)
        tower({ x: 200, y: 300 }, 50, 100)
        tower({ x: 500, y: 300 }, 50, 100)
    }

    p5.draw = () => {
        for (let i = 0; i < 2; i++) {
            if (drawCalls.length <= drawCallIndex) {
                return
            }

            drawCalls[drawCallIndex]()

            drawCallIndex++
        }
    }

    function tower(pos, width, height) {
        const radius = 50 / 2

        cylinder(pos, height, (step, nSteps) => {
            return width + Math.sin(p5.map(step, 0, nSteps, 0, Math.PI * 2 * 4.5)) * 4
        })

        const topCenter = { x: pos.x, y: pos.y - height }
        const blockSize = 5
        const nBlocks = 10
        for (let i = 0; i < nBlocks; i++) {
            const xoffset = Math.cos(i / nBlocks * Math.PI * 2) * radius
            const yoffset = Math.sin(i / nBlocks * Math.PI * 2) * (radius / PERSPECTIVE)
            cube({ x: topCenter.x + xoffset - blockSize, y: topCenter.y + yoffset - blockSize * 1.5 }, blockSize, blockSize * 2, blockSize, null, true)
        }
    }

    function cylinder(pos, nSteps, stepsFn, horizontal) {
        for (let i = 0; i < nSteps; i++) {
            const size = stepsFn(i, nSteps)
            if (horizontal) {
                hEllipse({x: pos.x + i, y: pos.y}, size)
            } else {
                vEllipse({x: pos.x, y: pos.y - i}, size)
            }
        }
    }

    function cube(pos, width, height, depth, color, fill) {
        line( // top
            { x: pos.x, y: pos.y },
            { x: pos.x + width, y: pos.y }
        )
        line( // left
            { x: pos.x, y: pos.y },
            { x: pos.x, y: pos.y + height }
        )
        line( // bottom
            { x: pos.x, y: pos.y + height },
            { x: pos.x + width, y: pos.y + height }
        )
        line( // left
            { x: pos.x + width, y: pos.y},
            { x: pos.x + width, y: pos.y + height }
        )
        line( // edge top left
            { x: pos.x, y: pos.y },
            { x: pos.x + depth / PERSPECTIVE, y: pos.y - depth / PERSPECTIVE }
        )
        line( // edge top right
            { x: pos.x + width, y: pos.y },
            { x: pos.x + width + depth / PERSPECTIVE, y: pos.y - depth / PERSPECTIVE }
        )
        line( // edge top right
            { x: pos.x + width, y: pos.y + height },
            { x: pos.x + width + depth / PERSPECTIVE, y: pos.y + height - depth / PERSPECTIVE}
        )
        line( // back top
            { x: pos.x + depth / PERSPECTIVE, y: pos.y - depth / PERSPECTIVE },
            { x: pos.x + width + depth / PERSPECTIVE, y: pos.y - depth / PERSPECTIVE }
        )
        line( // back top
            { x: pos.x + width + depth / PERSPECTIVE, y: pos.y - depth / PERSPECTIVE},
            { x: pos.x + width + depth / PERSPECTIVE, y: pos.y + height - depth / PERSPECTIVE}
        )

        if (fill) {
            // front face
            for (let x = 0; x < width; x += 1) {
                const from = {
                    x: pos.x + x,
                    y: pos.y
                }
                const to = {
                    x: pos.x + x,
                    y: pos.y + height
                }
                line(from, to)
            }
            // top face
            for (let x = 0; x < width; x += 1) {
                const from = {
                    x: pos.x + x,
                    y: pos.y
                }
                const to = {
                    x: pos.x + x + depth / PERSPECTIVE,
                    y: pos.y - depth / PERSPECTIVE
                }
                line(from, to)
            }
            // right face
            for (let y = 0; y < height; y += 1) {
                const from = {
                    x: pos.x + width,
                    y: pos.y + y
                }
                const to = {
                    x: pos.x + width + depth / PERSPECTIVE,
                    y: pos.y + y - depth / PERSPECTIVE
                }
                line(from, to)
            }
             }
    }

    function line(from, to, color) {
        drawCalls.push(() => {
            p5.line(from.x, from.y, to.x, to.y)
        })
    }
    function hEllipse(pos, height, color) {
        drawCalls.push(() => {
            p5.ellipse(pos.x, pos.y, height / PERSPECTIVE, height)
        })
    }
    function vEllipse(pos, width, color) {
        drawCalls.push(() => {
            p5.ellipse(pos.x, pos.y, width, width / PERSPECTIVE)
        })
    }
})
