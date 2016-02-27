;(function(){
    var canvas = document.getElementById('c');
    var ctx = canvas.getContext('2d');

    canvas.width = 840;
    canvas.height = 480;
    canvas.addEventListener('mousedown', mouseClick);
    canvas.addEventListener('mousemove', mouse);

    var springs = [];
    var n = 8
    var gameStat = true;
    var winPositions = []
    bounce = { x: 0, y: 0 }
    realBounce = {x: 0, y: 0}
    var score = 0;
    var highScore = 0;

    function newGame(n){
        springs = []
        winPositions = []
        for (var i = 0; i < n; i++) {
            var x = Math.floor((Math.random() * (canvas.width-280)) + 30);
            var y = Math.floor((Math.random() * (canvas.height- 30)) + 30);
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
    }

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
        ctx.clearRect(0,0,canvas.width,canvas.height);
        changeRealBouncePos();

        ctx.font="20px Georgia";
        ctx.fillText("Level: "+(n-5),canvas.width-200, 30);
        ctx.fillText("Score: "+score,canvas.width-200, 50);
        ctx.fillText("High score: "+highScore,canvas.width-200, 70);

        GreenYellowRed = ['#0f0','#ff0','#f00']
        for (var i = 0; i < winPositions.length; i++) {
            ctx.beginPath();
            ctx.strokeStyle = GreenYellowRed[i]
            ctx.arc(winPositions[i].x,winPositions[i].y,12,0,2*Math.PI);
            ctx.stroke();
            ctx.closePath();
        };

        for (var i = 0; i < springs.length; i++) {
            ctx.beginPath();
            ctx.moveTo(realBounce.x,realBounce.y);
            ctx.lineTo(springs[i].x, springs[i].y);
            if (springs[i].marked) ctx.strokeStyle = '#00f';
            else ctx.strokeStyle = '#000';
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(springs[i].x,springs[i].y,5,0,2*Math.PI);
            ctx.fill();
            ctx.closePath();
        }

        ctx.beginPath();
        ctx.arc(realBounce.x,realBounce.y,10,10,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();
        if (springs.length <= winPositions.length && (Math.abs(realBounce.x-bounce.x) <= 1) && (Math.abs(realBounce.y-bounce.y) <= 1))
            roundOver();
    }

    function mouseClick(e) {
        for (var i = 0; i < springs.length; i++) {            
            if (springs[i].marked) {springs.splice(i, 1);}
        }
        move();
        
    }

    function mouse(e) {
        for (var i = 0; i < springs.length; i++) {
            var dx = (e.clientX-realBounce.x)/(springs[i].x-realBounce.x);
            var dy = (e.clientY-realBounce.y)/(springs[i].y-realBounce.y);
            if (Math.abs(dx - dy) <= .1 && (e.clientX <= realBounce.x && e.clientX >= springs[i].x || e.clientX >= realBounce.x && e.clientX <= springs[i].x))
            {
                springs[i].marked = true;
            }
            else {
                springs[i].marked = false;
            }
        }
        changeBouncePos();
        move();
    }

    function roundOver(){

        if (findPointPosInWinPositions(bounce) != -1){
            n++;
            score += (3-findPointPosInWinPositions(bounce))*50
            if (score > highScore)
                highScore = score
            newGame(n);
            
        }
        else {
            n = 6;
            if (score > highScore)
                highScore = score;
            score = 0;
            newGame(n);
        }
    }

})();
