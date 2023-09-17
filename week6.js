let playerColor = 'rgb(255, 255, 160)'
let wallColor = '#EEF0D0'
let coinColor = '#F9F905'

let doubleJump = true
let jumpForce = -7

let canJump = false
let score = 0,
    maxScore
let win

let entities = []
let coins = []


let isHitting = {
    top: "",
    bottom: "",
    left: "",
    right: ""
}

// let topEdge, bottomEdge, leftEdge, rightEdge

let bHit, tHit, lHit, rHit
let lMoving, rMoving

let gravityAcceleration = 0.2
let friction = 0.8
let size = 700

let player = {
    xPosition: 350,
    yPosition: 350,
    xSpeed: 0,
    ySpeed: 0,
    size: 50,
    step: 1
}

let hitBottom, hitTop, hitLeft, hitRight



function setup() {
    frameRate(59)
    createCanvas(700, 700)
    textSize(25)
    rectMode(CENTER)

    //hitCheckers
    entities.push(new objects("hitBottom", 0, 0, 35, 10, 0, 0, 0, 0, "hitbox"))
    entities.push(new objects("hitLeft", 0, 0, 5, 35, 0, 0, 0, 0, "hitbox"))
    entities.push(new objects("hitTop", 0, 0, 35, 5, 0, 0, 0, 0, "hitbox"))
    entities.push(new objects("hitRight", 0, 0, 5, 35, 0, 0, 0, 0, "hitbox"))
    //walls
    entities.push(new objects("bWall", 350, size, size, 10, 0, 0, 0, 0, "wall"))
    entities.push(new objects("lWall", 0, 350, 10, size, 0, 0, 0, 0, "wall"))
    entities.push(new objects("rWall", size, 350, 10, size, 0, 0, 0, 0, "wall"))
    entities.push(new objects("tWall", 350, 0, size, 10, 0, 0, 0, 0, "wall"))
    //platforms
    entities.push(new objects("platform1", 350, 550, 200, 40, 0, 0, 0, 0, "platform"))
    entities.push(new objects("platform2", 150, 375, 150, 40, 0, 0, 0, 0, "platform"))
    entities.push(new objects("platform3", 550, 200, 175, 40, 0, 0, 0, 0, "platform"))


    //coins
    coins.push(new coinObjects("coin1", 350, 650, random(40, 60), false, 0))
    coins.push(new coinObjects("coin2", 150, 300, random(40, 60), false, 0))
    coins.push(new coinObjects("coin3", 550, 120, random(40, 60), false, 0))

    maxScore = coins.length



    for (let i = 0; i < entities.length; i++) {
        if (entities[i].name == "hitBottom") {
            hitBottom = entities[i]
        }
        if (entities[i].name == "hitLeft") {
            hitLeft = entities[i]
        }
        if (entities[i].name == "hitTop") {
            hitTop = entities[i]
        }
        if (entities[i].name == "hitRight") {
            hitRight = entities[i]
        }
    }

}

function draw() {
    background('#DEE0E5')
    movement()
    createEntities()
    checkWin()
    physics()
    hitCheck()
    if (!win) {
        tutorialText()
    }

}


function keyPressed() {
    if (keyCode == 38 && canJump == true) {
        player.yPosition -= 5
        player.ySpeed = jumpForce
    } else if (keyCode == 38 && canJump == false && doubleJump == true) {
        player.ySpeed = jumpForce
        doubleJump = false
    }
}


function physics() {
    // gravity
    player.ySpeed = player.ySpeed + gravityAcceleration;
    player.yPosition = player.yPosition + player.ySpeed;

    // horizontal friction and speed
    player.xSpeed = player.xSpeed * friction;
    player.xPosition = player.xPosition + player.xSpeed;


}

function movement() {
    if (keyIsDown(LEFT_ARROW) ||
        keyIsDown(RIGHT_ARROW)) {

        if (keyIsDown(LEFT_ARROW)) {
            player.xSpeed -= 1
            lMoving = true
        } else {
            lMoving = false
        }
        if (keyIsDown(RIGHT_ARROW)) {
            player.xSpeed += 1
            rMoving = true
        } else {
            rMoving = false
        }
    }

}

class coinObjects {
    constructor(name, xPos, yPos, diameter, picked, growRate) {
        this.name = name
        this.xPos = xPos
        this.yPos = yPos
        this.diameter = diameter
        this.picked = picked
        this.growRate = growRate
    }

    create() {
        this.diameter = map(sin(this.growRate), -1, 1, 50, 60)

        stroke(0)
        fill(coinColor)
        circle(this.xPos, this.yPos, this.diameter)

        this.growRate += 0.05
    }
}

class objects {

    constructor(name, xPos, yPos, width, height, topEdge, leftEdge, rightEdge, bottomEdge, type) {
        this.name = name
        this.xPos = xPos
        this.yPos = yPos
        this.height = height
        this.width = width
        this.topEdge = topEdge
        this.leftEdge = leftEdge
        this.rightEdge = rightEdge
        this.bottomEdge = bottomEdge
        this.type = type
    }

    intersects(other) {

        this.edges()
        other.edges()

        if (this.bottomEdge > other.topEdge && this.rightEdge > other.leftEdge &&
            this.leftEdge < other.rightEdge && this.topEdge < other.bottomEdge) {
            return true
        } else {
            return false
        }
    }

    mesh(x, y) {
        this.xPos = x
        this.yPos = y
    }

    edges() {
        this.topEdge = this.yPos - this.height / 2
        this.bottomEdge = this.yPos + this.height / 2
        this.leftEdge = this.xPos - this.width / 2 - 1
        this.rightEdge = this.xPos + this.width / 2 + 1
    }

    create() {
        if (this.type != "wall" && this.type != "hitbox") {
            stroke(0)
        } else {
            noStroke()
        }

        if (this.type == "hitbox") {
            noFill()
        } else {
            fill(wallColor)
        }
        rect(this.xPos, this.yPos, this.width, this.height)
    }
}

function createEntities() {
    for (c of coins) {
        if (!c.picked) {
            c.create()
        }
    }

    //player
    fill(playerColor)
    square(player.xPosition, player.yPosition, player.size)

    hitBottom.mesh(player.xPosition, player.yPosition + player.size / 2)
    hitTop.mesh(player.xPosition, player.yPosition - player.size / 2 + hitTop.height / 2)
    hitLeft.mesh(player.xPosition - player.size / 2 + hitLeft.width / 2, player.yPosition)
    hitRight.mesh(player.xPosition + player.size / 2 - hitRight.width / 2, player.yPosition)

    for (b of entities) {
        b.create()
    }



}

function tutorialText() {
    fill('#000000')
    stroke(0)
    textAlign(LEFT)
    text("Use Arrow Keys", 25, 40)
    text("To Move", 25, 70)

    textAlign(RIGHT)
    text("Pick Up All Coins", size-25, 40)
    text("To Win The Game", size-25, 70)

}


function hitCheck() {

    for (i = 0; i < entities.length; i++) {

        // bottom hit
        if ((entities[i].name != "hitBottom") && hitBottom.intersects(entities[i])) {
            bHit = entities[i]
        }

        // top hit
        if ((entities[i].name != "hitTop") && hitTop.intersects(entities[i])) {
            tHit = entities[i]
        }

        // left hit
        if ((entities[i].name != "hitLeft") && hitLeft.intersects(entities[i])) {
            lHit = entities[i]
        }

        // right hit
        if ((entities[i].name != "hitRight") && hitRight.intersects(entities[i])) {
            rHit = entities[i]
        }
    }

    for (i = 0; i < coins.length; i++) {
        if (dist(player.xPosition, player.yPosition, coins[i].xPos, coins[i].yPos) < player.size / 2 + coins[i].diameter) {
            coins[i].picked = true
            coins[i].xPos = -100
            score++
        }
    }

    //bottom hit
    if (bHit) {
        isHitting.bottom = bHit.name
        player.ySpeed = 0
        player.yPosition = bHit.yPos - bHit.height / 2 - player.size / 2
        canJump = true
        doubleJump = true
    } else {
        isHitting.bottom = "nothing"
        canJump = false
    }

    //top hit
    if (tHit) {
        isHitting.top = tHit.name
        player.ySpeed = 0
        player.yPosition = tHit.yPos + tHit.height / 2 + player.size / 2
    } else {
        isHitting.top = "nothing"
    }

    //left hit
    if (lHit && !rMoving) {
        isHitting.left = lHit.name
        player.xSpeed = 0
        player.xPosition = lHit.xPos + lHit.width / 2 + player.size / 2
    } else {
        isHitting.left = "nothing"
    }

    //right hit
    if (rHit && !lMoving) {
        isHitting.right = rHit.name
        player.xSpeed = 0
        player.xPosition = rHit.xPos - rHit.width / 2 - player.size / 2
    } else {
        isHitting.right = "nothing"
    }

    bHit = null
    tHit = null
    lHit = null
    rHit = null
}

function checkWin() {
    if (score == maxScore) {
        fill(coinColor)
        textSize(100)
        textAlign(CENTER)
        text("YOU WIN", 350, 350)
        win = true
    }
}