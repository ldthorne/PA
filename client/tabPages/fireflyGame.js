
function FireflyNet(x,y,r,c) {
	this.x=x; 
	this.y=y; 
	this.r=r; 
	this.c=c;
}

FireflyNet.prototype.caught = function(f) {
	var d = distFromOrigin(f.x-this.x,f.y-this.y);
	return(d<(f.r+this.r));
}

Session.set("dead", 0);
Session.set("currentTime", Date());
var remainingTime = 500;
var countdown = new ReactiveCountdown(remainingTime);

Template.fireflyGame.helpers({
	fliesfunc: function(){return Session.get("dead")},
	allDead: function(){return (Session.get("dead")==200)},
	remainingAlive: function(){return (200-Session.get("dead"))},
	timeElapsed: function(){return (Session.get("currentTime")-lastTime)},

	'getcountdown': function(){
		return countdown.get();
	},
	'timeSpent': function(){
		var currentTime = countdown.get();
		var tTime = remainingTime
		totalTimeSpent = tTime-currentTime;
		return totalTimeSpent;
	},
});


function distFromOrigin(x,y) { return Math.sqrt(x*x + y*y);}

function Firefly(x,y,r,c,vx,vy){
	this.x=x;
	this.y=y;
	this.r=r;
	this.c=c;
	this.vx=vx;
	this.vy=vy;
	this.alive = true;
}

Firefly.prototype.update = function(dt){
	if ((this.y + this.r >= 100) || (this.y - this.r <= 0)) this.vy *= -1;
	if ((this.x + this.r >= 100 )|| (this.x - this.r <= 0)) this.vx *= -1;
	this.x += this.vx*dt;
	this.y += this.vy*dt;

}

f1 = new Firefly(50,50,5,"orange",10,-5);
f2 = new Firefly(50,50,10,"grey",45,15);

function FireflyModel(){
	this.w=100;
	this.h=100;
	this.net = new FireflyNet(10,10,10,"black");
	this.fireflyList = [];
	this.bgcolor="red";
}

FireflyModel.prototype.addFirefly = function(f){
	this.fireflyList.push(f);
}
FireflyModel.prototype.update = function(dt){
	var theNet = this.net;
	_.each(this.fireflyList,
		   function(f){
			   f.update(dt);
			   if (theNet.caught(f)) {
				   f.alive = false;
				   Session.set("dead", Session.get("dead")+1);
			   }
		   
		   }
	   );
	this.fireflyList = _.filter(this.fireflyList,
								function(f){return f.alive})
}

theModel = new FireflyModel();  // we just create the model!
theModel.addFirefly(f1);
theModel.addFirefly(f2);
for(var i =0; i<198; i++){
	var myvx = Math.random()*10-5;
	var myvy = (Math.random()-0.5)*10;
	var c = (Math.random()<0.5)?"green":"blue";
	theModel.addFirefly(new Firefly(50,50,1,c,myvx,myvy))
}

var counter=0;
var firstTime = (new Date()).getTime();
var lastTime = (new Date()).getTime();

function draw(){

	var drawContext = gameboard.getContext("2d");
	
	drawContext.fillStyle="purple";
	drawContext.fillRect(0,0,gameboard.width,gameboard.height);
	drawContext.strokeStyle="#f00";

	_.each(theModel.fireflyList,
		function(f) {
			if (!f.alive) return;
			drawContext.fillStyle = f.c;
      		drawContext.lineWidth = 5;
			drawContext.strokeStyle = "lightslategray";
			drawContext.beginPath();
			drawContext.arc(f.x*gameboard.width/100,
							f.y*gameboard.height/100,
							f.r*gameboard.width/100,
							0,2*Math.PI,true);
			drawContext.fill();
			drawContext.stroke();
		}
	);
	
	
	var net = theModel.net;
	drawContext.lineWidth = 15;
	drawContext.strokeStyle = net.c;
	drawContext.fillStyle = "hotpink";
	drawContext.beginPath();
	drawContext.arc(net.x*gameboard.width/100,
					net.y*gameboard.height/100,
					net.r*gameboard.width/100,
					0,2*Math.PI,true);
	drawContext.fill();
	drawContext.stroke();
		
}

function gameLoop(){
	var theTime = (new Date()).getTime();
	var dt = theTime - lastTime; // in milliseconds
	lastTime = theTime;
	var fps = 1000/(dt);

	theModel.update(dt/500.0);
	draw();
	
	if (running) 
		window.requestAnimationFrame(gameLoop);
}

drawIt = draw;
var running = false;



Template.fireflyGame.events({
	"click #startgame": function(event){

		if (!running) {
			countdown.start(function(){});
			lastTime = (new Date()).getTime();
			running=true;
			gameLoop();
			$("#startgame").html("Stop");

		} else {
			countdown.stop(function(){});
			running=false;
			$("#startgame").html("Start");
		}
		
	},
	"submit #submitScore": function(event){
			event.preventDefault();

			// var timeSpent = event.target.timeSpent.value;
      		var uid = Meteor.userId();
      		var name = event.target.name.value;

			Scores.insert({uid:uid, timeTook:totalTimeSpent, name:name});

			Router.go('/leaderboard');
			
	}
})
Template.fireflyGame.rendered = function(){
document.getElementById("gameboard").addEventListener('mousemove', 
  function(e){
   if (running) {
    	theModel.net.x = 100*(e.pageX-gameboard.offsetLeft)/gameboard.width;
    	theModel.net.y = 100*(e.pageY-gameboard.offsetTop)/gameboard.height;
 	 }
  }
);

}