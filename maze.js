width = 25           //Number roads fitted horisontally
height = 25          //Number roads fitted vertically
seed = Math.random()*100000|0//Seed for random numbers
roadWidth = 10       //Width of the Maze road
wall = 2             //Width of the Walls between roads
outerWall = 2        //Width of the Outer most wall
x = width/2|0        //Horisontal starting position
y = height/2|0       //Vertical starting position
roadColor = '#00a800'//Color of the road
wallColor = '#141414'   //Color of the walls

//make seed
randomGen = function(seed){
	if(seed===undefined)var seed=performance.now()
	return function(){
    seed = (seed * 9301 + 49297) % 233280
		return seed/233280
	}
}

//set vals and make maze
init = function(){
  offset = roadWidth/2+outerWall
  map = []
  canvas = document.querySelector('canvas')
  canvas.height = outerWall*2+height*(wall+roadWidth)-wall
  canvas.width = outerWall*2+width*(wall+roadWidth)-wall
  ctx = canvas.getContext('2d')
  ctx.fillStyle = wallColor
  ctx.fillRect(0,0,canvas.width,canvas.height)
  random = randomGen(seed)
  ctx.strokeStyle = roadColor
  ctx.lineCap = 'square'
  ctx.lineWidth = roadWidth
  //build maze
  ctx.beginPath()
  for(var i=0;i<height*2;i++){
    map[i] = []
    for(var j=0;j<width*2;j++){
      map[i][j] = false
    }
  }
  map[y*2][x*2] = true
  route = [[x,y]]
  ctx.moveTo(x*(wall+roadWidth)+offset,
             y*(wall+roadWidth)+offset)
}
init()

inputWidth = document.getElementById('width')
inputHeight = document.getElementById('height')
inputSeed = document.getElementById('seed')
inputroadWidth = document.getElementById('roadwidth')
inputWallWidth = document.getElementById('wallwidth')
inputOuterWidth = document.getElementById('outerwidth')
inputroadColor = document.getElementById('roadcolor')
inputWallColor = document.getElementById('wallcolor')
buttonRandomSeed = document.getElementById('randomseed')

settings = {
  display: function(){
    inputWidth.value = width
    inputHeight.value = height
    inputSeed.value = seed
    inputroadWidth.value = roadWidth
    inputWallWidth.value = wall
    inputOuterWidth.value = outerWall
    inputroadColor.value = roadColor
    inputWallColor.value = wallColor

  },
  check: function(){
    if(inputWidth.value != width||
       inputHeight.value != height||
       inputSeed.value != seed||
       inputroadWidth.value != roadWidth||
       inputWallWidth.value != wall||
       inputOuterWidth.value != outerWall||
       inputroadColor.value != roadColor||
       inputWallColor.value != wallColor){
      settings.update()
    }
  },
  update: function(){
    clearTimeout(timer)
    width = parseFloat(inputWidth.value)
    height = parseFloat(inputHeight.value)
    seed = parseFloat(inputSeed.value)
    roadWidth = parseFloat(inputroadWidth.value)
    wall = parseFloat(inputWallWidth.value)
    outerWall = parseFloat(inputOuterWidth.value)
    roadColor = inputroadColor.value
    wallColor = inputWallColor.value
    x = width/2|0
    y = height/2|0
    init()
    loop()
  }
}

buttonRandomSeed.addEventListener('click',function(){
  inputSeed.value = Math.random()*100000|0
})

loop = function(){
  x = route[route.length-1][0]|0
  y = route[route.length-1][1]|0
  
  var directions = [[1,0],[-1,0],[0,1],[0,-1]],
      alternatives = []
  
  for(var i=0;i<directions.length;i++){
    if(map[(directions[i][1]+y)*2]!=undefined&&
       map[(directions[i][1]+y)*2][(directions[i][0]+x)*2]===false){
      alternatives.push(directions[i])
    }
  }
  
  if(alternatives.length===0){
    route.pop()
    if(route.length>0){
      ctx.moveTo(route[route.length-1][0]*(roadWidth+wall)+offset,
                 route[route.length-1][1]*(roadWidth+wall)+offset)
      timer = setTimeout(loop,1)
    }
    return;
  }
  direction = alternatives[random()*alternatives.length|0]
  route.push([direction[0]+x,direction[1]+y])
  ctx.lineTo((direction[0]+x)*(roadWidth+wall)+offset,
             (direction[1]+y)*(roadWidth+wall)+offset)
  map[(direction[1]+y)*2][(direction[0]+x)*2] = true
  map[direction[1]+y*2][direction[0]+x*2] = true
  ctx.stroke()
  timer = setTimeout(loop,1)
}
settings.display()
loop()
setInterval(settings.check,400)