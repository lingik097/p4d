let squares = []
let smallSquares = []
let mid = 350

function setup(){
    angleMode(DEGREES)
    frameRate(59)
    createCanvas(700, 700)
    rectMode(CENTER)

    for(let i = 0; i < 6; i++){
        squares.push(new animator(i*15, 200, 0))
    }
    for(let i = 0; i < 5; i++){
        smallSquares.push(new animator2(i*36, 100, 0))
    }
}


function draw() {
    background('#EEF0D0')
    for(s of squares){
        push()
        translate(mid, mid)
        s.animation()
        s.render()
        s.sizeVar += 1
        pop()
    }
    for(s of smallSquares){
        push()
        translate(mid, mid)
        s.animation()
        s.render()
        s.sizeVar += 2
        pop()
    }

}

class animator{
    constructor(z, size, sizeVar){
        this.z = z
        this.size = size
        this.sizeVar = sizeVar
    }
    animation(){
        rotate(this.z)
        this.z -= 0.2
        
        this.size = map(sin(this.sizeVar), -1, 1, 300, 400)
    }
    render(){
        noFill()
        square(0, 0, this.size)
    }
}

class animator2{
    constructor(z, size, sizeVar){
        this.z = z
        this.size = size
        this.sizeVar = sizeVar
    }
    animation(){
        rotate(this.z)
        this.z += 0.2
        
        this.size = map(sin(this.sizeVar), -1, 1, 200, 300)
    }
    render(){
        noFill()
        square(0, 0, this.size)
    }
}