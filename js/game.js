;(function(){
	var canvas = document.getElementById('c');
	var ctx = canvas.getContext('2d');
	
	myStorage = localStorage;
	if (screen.width <= screen.height)
	{
		canvas.width = 800;
		canvas.height = 996;
	}
	else{
		canvas.width = 1000;
		canvas.height = 776;
	}
	
	canvas.addEventListener('mousedown', mouseClick);
	canvas.addEventListener('mousemove', mouse);
	canvas.addEventListener('touchstart',touchDown);
	
	var springs = [];
	var n = 6
	var gameStat = true;
	var winPositions = []
	var bounce = { x: 0, y: 0 }
	var realBounce = {x: 0, y: 0}
	var score = 0;
	var highScore = 0;
	var lifes = 0;
	var mobilerect = canvas.getBoundingClientRect();
	
	if (myStorage.getItem('highScore') != undefined)
		highScore = parseInt(myStorage.getItem('highScore'))
	function checkNailPosition(x, y) {
		for (var i = 0; i < springs.length; i++)
			if (Math.abs(springs[i].x - x) < 75 && Math.abs(springs[i].y - y) < 75)
				return true;
		return false;
	};
	function newGame(n){
		springs = [];
		winPositions = [];
		for (var i = 0; i < n; i++) {

			var x = Math.floor((Math.random() * (canvas.width-280)) + 50);
			var y = Math.floor((Math.random() * (canvas.height- 100)) + 50);
			while  (checkNailPosition(x,y)){
				x = Math.floor((Math.random() * (canvas.width-280)) + 50);
				y = Math.floor((Math.random() * (canvas.height- 100)) + 50);
			}
			springs.push(new spring(x,y));			
		};
		changeBouncePos();
		realBounce.x = bounce.x;
		realBounce.y = bounce.y;
		for (var i=0; i<3; i++){
			var wp = winPosition();
			while (findPointPosInWinPositions(wp) != -1){wp = winPosition();}
			winPositions.push(wp);
		}        
	};

	function winPosition(){
		var avgX = 0;
		var avgY = 0;
		var n = Math.floor((Math.random() * springs.length) + 1);
		for (var i = n; i < n+3; i++){
			avgX += springs[i % springs.length].x;
			avgY += springs[i % springs.length].y;
		}     
		return {x: avgX / 3, y: avgY /= 3};
	}

	function findPointPosInWinPositions(wp){
		for (var i = 0; i < winPositions.length; i++)
			if ((winPositions[i].x == wp.x) && winPositions[i].y == wp.y){return i}
		return -1
	}

	function spring(x, y, len){
		this.x = x;
		this.y = y;
		this.marked = false;
	}

    newGame(n);
    move();

	setInterval(function() {
		move();
	},10);

	function changeBouncePos(){
		var avgX = 0;
		var avgY = 0;
		for (var i = 0; i < springs.length; i++) {
			ctx.closePath();
			avgX += springs[i].x;
			avgY += springs[i].y;
		}
		avgY /= springs.length;
		avgX /= springs.length;
		bounce.x = avgX;
		bounce.y = avgY;
	}

	function changeRealBouncePos(){
		realBounce.x -= (realBounce.x-bounce.x)/100;
		realBounce.y -= (realBounce.y-bounce.y)/100;
	}

	function move() {
		var nailTexture = new Image();
		nailTexture.src = 'image/nailTexture.png'
		ctx.clearRect(0,0,canvas.width,canvas.height);
		changeRealBouncePos();

		ctx.font="20px Georgia";
		ctx.fillText("Level: "+(n-5),canvas.width-200, 30);
		ctx.fillText("Score: "+score,canvas.width-200, 50);
		ctx.fillText("High score: "+highScore,canvas.width-200, 70);
		ctx.fillText("Lifes: "+lifes,canvas.width-200, 90);

		GreenYellowRed = ['#76E42F','#FF9E34','#EB305F']
		for (var i = 0; i < winPositions.length; i++) {
			ctx.beginPath();
			ctx.strokeStyle = GreenYellowRed[i]
			ctx.arc(winPositions[i].x,winPositions[i].y,17,0,2*Math.PI);
			ctx.lineWidth = 5;
			ctx.stroke();
			ctx.closePath();
		};
		ctx.lineWidth = 1;
		for (var i = 0; i < springs.length; i++) {
			ctx.beginPath();
			ctx.moveTo(realBounce.x,realBounce.y);
			ctx.lineTo(springs[i].x, springs[i].y);
			if (springs[i].marked) ctx.strokeStyle = '#06688E';
			else ctx.strokeStyle = '#012533';
			ctx.stroke();
			ctx.closePath();
			ctx.drawImage(nailTexture,springs[i].x-12,springs[i].y-10,20,20)
			
		}

		ctx.beginPath();
		ctx.arc(realBounce.x,realBounce.y,15,15,0,2*Math.PI);
		ctx.fill();
		ctx.closePath();
		if (springs.length <= winPositions.length && (Math.abs(realBounce.x-bounce.x) <= 1) && (Math.abs(realBounce.y-bounce.y) <= 1))
			roundOver();
	}

	
	function mouse(e) {
		var rect = canvas.getBoundingClientRect();
		for (var i = 0; i < springs.length; i++) {
			var dx = Math.abs(e.clientX - rect.left - springs[i].x)
			var dy = Math.abs(e.clientY - rect.top - springs[i].y)
			if (dx < 10 && dy <= 10 ){
				springs[i].marked = true;
			}
			else{
				springs[i].marked = false;
			}		
		}
		move();
	}
	function mouseClick(e) {
		for (var i = 0; i < springs.length; i++) {            
			if (springs[i].marked && springs.length > 3) {
				springs.splice(i, 1);
				changeBouncePos();
				move();
				return;
			}
		}	
	}
	function touchDown(e){
		for (var i = 0; i < springs.length; i++) 
		{
			var dx = Math.abs(e.targetTouches[0].pageX - mobilerect.left - springs[i].x)
			var dy = Math.abs(e.targetTouches[0].pageY - mobilerect.top - springs[i].y)
			if (dx < 40 && dy <= 40 && springs.length > 3){
				springs.splice(i, 1);
				changeBouncePos();
				move();
				return;
			}			
		}
		
	}
	function roundOver(){

		if (findPointPosInWinPositions(bounce) != -1 && springs.length == 3){
			n++;
			score += (3-findPointPosInWinPositions(bounce))*50
			lifes += (2-findPointPosInWinPositions(bounce)) * 0.5
		if (score > highScore){
			highScore = score
			myStorage.setItem('highScore',highScore)
		}
		newGame(n);
		return;

		}
		if (findPointPosInWinPositions(bounce) == -1 && lifes < 1){
			n = 6;
			lifes = 0;
			score = 0;
			newGame(n);
			return;
		}
		if (findPointPosInWinPositions(bounce) == -1 && lifes >= 1){
			lifes -= 1;
			score -= 25;
			newGame(n)
			return;
		}
	}

})();
