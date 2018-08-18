(function() {
  var game = {};

  game.init = function() {
    this.canvas = document.getElementById("gameCanvas");
    this.canvasContext = this.canvas.getContext("2d");
    this.ballX = 0;
    this.ballSpeedX = 10;
    this.ballY = 0;
    this.ballSpeedY = 5;
    this.paddleLeftY = 200;
    this.paddleRightY = 100;
    this.paddleHeight = 100;
    this.playScore = 0;
    this.computerScore = 0;
    this.winScore = 3;
    this.showWinnig = false;

    var fps = 60;
    this.canvas.addEventListener("mousedown", game.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", game.handleMouseMove.bind(this));
    this.intervalId = setInterval(game.handleDraw.bind(this), 1000 / fps);
  };
  game.handleMouseDown = function(evt) {
    if (this.showWinnig) {
      this.playScore = 0;
      this.computerScore = 0;
      this.showWinnig = false;
    }
  };
  game.handleMouseMove = function(evt) {
    var position = game.caculateMousePosition(evt);
    this.paddleLeftY = position.Y - this.paddleHeight / 2;
  };
  game.caculateMousePosition = function(evt) {
    var rect = this.canvas.getBoundingClientRect();
    var root = document.documentElement;
    return {
      X: evt.clientX - rect.left - root.scrollLeft,
      Y: evt.clientY - rect.top - root.scrollTop
    };
  };
  game.handleDraw = function() {
    if (this.showWinnig) {
      var winText = "";
      if (this.playScore >= this.winScore) {
        winText = "YOU WON";
      } else if (this.computerScore >= this.winScore) {
        winText = "COMPUTER WON";
      }

      this.canvasContext.fillText(winText, 350, 300);
    } else {
    game.drawTable();
      game.move();
    }
  };
  game.drawNet = function() {
    var centerX = this.canvas.width / 2 - 2;
    for (var i = 0; i < this.canvas.height; i += 40) {
      this.drawRect(centerX, i, 4,25, 'white');
    }
  };
  game.drawTable = function() {
    
    game.drawRect(0, 0, this.canvas.width, this.canvas.height, "black");
    game.drawRect(0, this.paddleLeftY, 10, this.paddleHeight, "white");
    game.drawRect(790, this.paddleRightY, 10, this.paddleHeight, "white");

    game.drawNet();
    
    game.drawCircle(this.ballX, this.ballY, 10, 100, "white");

    game.canvasContext.fillText(this.playScore, 100, 100);
    game.canvasContext.fillText(
      this.computerScore,
      this.canvas.width - 100,
      100
    );
  };

  game.drawCircle = function(centerX, centerY, radius, circleColor) {
    this.canvasContext.fillStyle = circleColor;
    this.canvasContext.beginPath();
    this.canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    this.canvasContext.fill();
  };
  game.drawRect = function(startX, startY, width, height, rectColor) {
    this.canvasContext.fillStyle = rectColor;
    this.canvasContext.fillRect(startX, startY, width, height);
  };
  game.reset = function() {
    if (
      this.playScore >= this.winScore ||
      this.computerScore >= this.winScore
    ) {
      this.showWinnig = true;
    }
    this.ballSpeedX = -this.ballSpeedX;
    this.ballX = this.canvas.width / 2;
    this.ballY = this.canvas.height / 2;
  };
  game.cumputerMove = function() {
    var distanse = this.paddleRightY + this.paddleHeight / 2 - this.ballY;
    if (distanse > 35) {
      this.paddleRightY -= 6;
    } else if (distanse < -35) {
      this.paddleRightY += 6;
    }
  };
  game.move = function() {
    game.cumputerMove();

    if (this.ballX < 0) {
      if (
        Math.abs(this.ballY - (this.paddleLeftY + this.paddleHeight / 2)) <=
        this.paddleHeight / 2
      ) {
        this.ballSpeedX = -this.ballSpeedX;

        var deltaY = this.ballY - (this.paddleLeftY + this.paddleHeight / 2);
        this.ballSpeedY = deltaY * 0.2;
      } else {
        this.computerScore++;
        game.reset();
      }
    }
    if (this.ballX >= this.canvas.width) {
      if (
        Math.abs(this.ballY - (this.paddleRightY + this.paddleHeight / 2)) <=
        this.paddleHeight / 2
      ) {
        this.ballSpeedX = -this.ballSpeedX;
        var deltaY = this.ballY - (this.paddleRightY + this.paddleHeight / 2);

        this.ballSpeedY = deltaY * 0.2;
      } else {
        this.playScore++;
        game.reset();
      }
    }

    if (this.ballY >= this.canvas.height || this.ballY < 0) {
      this.ballSpeedY = -this.ballSpeedY;
    }
    this.ballX += this.ballSpeedX;
    this.ballY += this.ballSpeedY;
  };
  window.addEventListener("load", game.init());
})();

// 1. draw order is important, later one will overlap previous one
