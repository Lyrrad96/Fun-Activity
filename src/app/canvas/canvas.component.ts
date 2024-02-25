import { Component, Input, ElementRef, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'

class Drawer {

  _width: any
  _height: any
  heightOffset: any
  widthOffset: any
  canvas: any
  common: any
  penaltyArea: any
  goalArea: any
  playerSize: any
  playerArea: any
  penaltyArc: any
  groundCorner: any
  captioinText: string = "";
  canvasElement: any
  context: any

  constructor(width: any, height: any, widthOffset: any, heightOffset: any) {
    this._width = width
    this._height = height
    this.widthOffset = widthOffset
    this.heightOffset = heightOffset

    this.canvas = {
      width: this._width,
      height: this._height,
      halfWidth: this._width / 2,
      lineWith: 2,
  // background: url(../../assets/field.png) no-repeat;

      backgorund: { Default: "#08a107", Orange: "#f60", Green: "#f80" },
      borerColor: { White: "#fff", Green: "#f80" },
      colorMap: { Orange: "#f60", Green: "#f80" }
    };
    this.common = {
      fillColor: { Default: "#0d5f0c", Green: "green", Red: "red", Orange: "#f60", White: "#fff" },
      borderColor: "#fff",
      fontFamily: " 'Segoe UI',Arial,sans-serif",
      font: { Default: "12px 'Segoe UI',Arial,sans-serif", Heading: "14px 'Segoe UI',Arial,sans-serif" },
      lineWidth: { Pixel1: 1, Pixel2: 2, Pixel3:3, Pixel4: 4, Pixel5: 5 },
      arrowLength:{Default:70,Pixel50:50}
    };
    this.penaltyArea = {
      height: Math.ceil((this.canvas.height * 70) / 100),
      width: Math.ceil((this.canvas.width * 10) / 100),
      yPosition: Math.ceil(((this.canvas.height * 30) / 100) / 2),
      xPosition: { TeamA: 0, TeamB: this.canvas.width - Math.ceil((this.canvas.width * 12) / 100) }
    };
    this.playerSize = {
      height: heightOffset,
      width: heightOffset,
    }
    this.playerArea = {
      height: this.playerSize.height,
      width: this.playerSize.width,
      yPositon: this.canvas.height/2-this.playerSize.height/2,
      xPosition: { TeamA: widthOffset-this.playerSize.width, TeamB: this.canvas.width - widthOffset }
    };
    // this.playerArea = {
    //   height: Math.ceil((this.penaltyArea.height * 60)/100),
    //   width: Math.ceil(this.penaltyArea.width / 2),
    //   yPositon: (this.canvas.height - this.penaltyArea.height),
    //   xPosition: { TeamA: 0, TeamB: Math.ceil(this.canvas.width - (this.penaltyArea.width / 2)) }
    // };
    this.goalArea = {
      height: Math.ceil((this.penaltyArea.height * 60)/100),
      width: Math.ceil(this.penaltyArea.width / 2),
      yPositon: (this.canvas.height - this.penaltyArea.height),
      xPosition: { TeamA: 0, TeamB: Math.ceil(this.canvas.width - (this.penaltyArea.width / 2)) }
    };
    this.penaltyArc = {
      xPosition: { TeamA: this.penaltyArea.width - this.goalArea.width / 4, TeamB: this.canvas.width - this.penaltyArea.width + this.goalArea.width / 4 },
      yPosition: this.canvas.height/2,
      radius:this.goalArea.height/3
    };
    this.groundCorner={
      radius:Math.ceil((this.canvas.height*2)/100)
    };

    console.log('%ccanvas.component.ts line:61 width, height, canvas, common, penaltyArea, goalArea, penaltyArc, groundCorner', 'color: #007acc;', width, height, this.common, this.penaltyArea, this.goalArea, this.penaltyArc, this.groundCorner);

    this.canvasElement = document.querySelector('canvas')
    this.context = this.canvasElement.getContext("2d");
  }

  setGroundStyles = () => {
    this.canvasElement.setAttribute("width", this.canvas.width);
    this.canvasElement.setAttribute("height", this.canvas.height);
    this.canvasElement.style.border = "2px solid " + this.canvas.borerColor.White;
    this.canvasElement.style.margin = "auto";
    this.canvasElement.style.background = this.canvas.backgorund.Default;
  }
  setRectangle = (widthOffset: any, heightOffset: any) => {
    this.context.beginPath();
    this.context.fillStyle = this.common.fillColor.Default;
    // this.context.fill();
    // this.context.fillRect(this.widthOffset, this.heightOffset, this.canvas.width - this.widthOffset, this.canvas.height - this.heightOffset);
    this.context.lineWidth = this.common.lineWidth.Pixel2;
    this.context.strokeStyle = this.common.borderColor;
    this.context.strokeRect(this.widthOffset, this.heightOffset, this.canvas.width - this.widthOffset*2, this.canvas.height - this.heightOffset*2);
    this.context.stroke();
  }
  drawCenterSpot = (xAxis: any, yAxis: any, radius: any) => {
    this.context.beginPath();
    this.context.arc(xAxis, yAxis, radius, 0, 2 * Math.PI);
    this.context.fillStyle = this.common.fillColor.Default;
    this.context.fill();
    this.context.lineWidth = this.common.lineWidth.Pixel2;
    this.context.strokeStyle = this.common.borderColor;
    this.context.stroke();
  }
  drawCorner = (xAxis: any, yAxis: any) => {
    this.context.beginPath();
    this.context.arc(xAxis, yAxis, this.groundCorner.radius, 0, 2 * Math.PI);
    this.context.fillStyle = this.common.fillColor.Default;
    this.context.fill();
    this.context.lineWidth = this.common.lineWidth.Pixel2;
    this.context.strokeStyle = this.common.borderColor;
    this.context.stroke();

  }
  //Rectangular Area
  drawPenaltyArea = (xAxis: any, yAxis: any) => {
    this.context.beginPath();
    this.context.fillStyle = this.common.fillColor.Default;
    this.context.fill();
    this.context.fillRect(xAxis, yAxis, this.penaltyArea.width, this.penaltyArea.height);
    this.context.lineWidth = this.common.lineWidth.Pixel2;
    this.context.strokeStyle = this.common.borderColor;
    this.context.strokeRect(xAxis, yAxis, this.penaltyArea.width, this.penaltyArea.height);
  }
  drawGoalArea = (xAxis: any, yAxis: any) => {
    this.context.beginPath();
    this.context.fillStyle = this.common.fillColor.Default;
    this.context.fill();
    this.context.fillRect(xAxis, yAxis, this.goalArea.width, this.goalArea.height);
    this.context.lineWidth = this.common.lineWidth.Pixel1;
    this.context.strokeStyle = this.common.borderColor;
    this.context.strokeRect(xAxis, yAxis, this.goalArea.width, this.goalArea.height);
  }
  drawPlayerArea = (xAxis: any, yAxis: any) => {
    this.context.beginPath();
    this.context.fillStyle = this.common.fillColor.Default;
    this.context.fill();
    this.context.fillRect(xAxis, yAxis, this.playerArea.width, this.playerArea.height);
    this.context.lineWidth = this.common.lineWidth.Pixel1;
    this.context.strokeStyle = this.common.borderColor;
    this.context.strokeRect(xAxis, yAxis, this.playerArea.width, this.playerArea.height);
  }

  drawPenaltyArc = (xAxis: any, yAxis: any, radius: any) => {
    this.context.beginPath();
    this.context.arc(xAxis, yAxis, radius, 0, 2 * Math.PI);
    this.context.fillStyle = this.common.fillColor.Default;
    this.context.fill();
    this.context.lineWidth = this.common.lineWidth.Pixel2;
    this.context.strokeStyle = this.common.borderColor;
    this.context.stroke();
  }
  drawPenaltySpot = (xAxis: any, yAxis: any, radius: any) => {
    this.context.beginPath();
    this.context.arc(xAxis, yAxis, radius, 0, 2 * Math.PI);
    this.context.fillStyle = this.common.fillColor.Default;
    this.context.fill();
    this.context.lineWidth = this.common.lineWidth.Pixel3;
    this.context.strokeStyle = this.common.borderColor;
    this.context.stroke();
  }

  writeText = (text: any, xAxis: any, yAxis: any, font: any,color: any) => {
    font = (typeof font == 'undefined') ? this.common.font.Default : font;
    color = (Drawer.arguments.length >= 5) ? color : this.common.fillColor.White;
    this.context.font = font;
    this.context.fillStyle = color;
    this.context.fillText(text, xAxis, yAxis);
  }

  drawLine = (x1: any, y1: any, x2: any, y2: any) => {
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
    this.context.lineWidth = this.common.lineWidth;
    this.context.fillStyle = this.common.fillColor.White;
    this.context.fill();
  }
  drawArrowLine = (x1: any, y1: any, x2: any, y2: any, isReverseArrow: any) => {
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.strokeStyle = this.common.fillColor.Orange;
    this.context.lineWidth = this.common.lineWidth.Pixel1;
    this.context.stroke();

    var x2ofLine = x2;
    var y2OfLine = y2;

    if (!isReverseArrow) {
        for (var i = 0; i <= 2; i++) {
            x1 = x2ofLine;
            y1 = ((i == 0) || (i == 2)) ? (y2OfLine - 4) : (y2OfLine + 4);
            x2 = (i == 2) ? (x2ofLine) : (x2ofLine + 4);
            y2 = (i == 2) ? (y2OfLine + 4) : y2OfLine;

            this.context.beginPath();
            this.context.moveTo(x1, y1);
            this.context.lineTo(x2, y2);
            this.context.lineWidth = this.common.lineWidth.Pixel2;
            this.context.strokeStyle = this.common.fillColor.Orange
            this.context.stroke();
        }
    }
    else {
        for (var i = 0; i <= 2; i++) {
            x1 = x2ofLine;
            y1 = ((i == 0) || (i == 2)) ? (y2OfLine + 4) : (y2OfLine - 4);
            x2 = (i == 2) ? (x2ofLine) : (x2ofLine - 4);
            y2 = (i == 2) ? (y2OfLine - 4) : y2OfLine;

            this.context.beginPath();
            this.context.moveTo(x1, y1);
            this.context.lineTo(x2, y2);
            this.context.lineWidth = 2;
            this.context.strokeStyle = this.common.fillColor.Orange;
            this.context.stroke();
        }
    }

  }

// drawCaptionForTeamA = (ground: any) => {
//     //Caption for Penalty Area
//     x1 = this.penaltyArea.width - 20;
//     y1 = this.canvas.height - this.penaltyArea.height;
//     x2 = x1 + this.common.arrowLength.Default;
//     y2 = y1;
//     ground.drawArrowLine(x1, y1, x2, y2, false);
//     this.captioinText = "Penalty Area";
//     ground.writeText(this.captioinText, x2, y2 - 10, this.common.font.Heading);

//     //Caption for Goal Area
//     x1 = this.goalArea.width - this.goalArea.width / 2;
//     y1 = this.canvas.height - this.goalArea.height + 60;
//     x2 = x1 + this.common.arrowLength.Pixel50;
//     y2 = y1;
//     ground.drawArrowLine(x1, y1, x2, y2, false);
//     this.captioinText = "Goal Area";
//     ground.writeText(this.captioinText, x2, y2 - 10, this.common.font.Heading);

//     //Caption for Penalty Arc
//     x1 = this.penaltyArea.width + 20;
//     y1 = this.canvas.height / 2;
//     x2 = x1 + this.common.arrowLength.Default;
//     y2 = y1;
//     ground.drawArrowLine(x1, y1, x2, y2, false);
//     this.captioinText = "Penalty Arc";
//     ground.writeText(this.captioinText, x2, y2 - 10, this.common.font.Heading);

//     //Caption for Penalty Spot
//     x1 = this.goalArea.width / 2;
//     y1 = this.canvas.height / 2;
//     x2 = x1 + this.common.arrowLength.Pixel50;
//     y2 = y1;
//     ground.drawArrowLine(x1, y1, x2, y2, false);
//     this.captioinText = "Penalty Spot";
//     ground.writeText(this.captioinText, x2, y2 - 10, this.common.font.Heading);
// }


// drawCaptionForTeamB = (ground: any) => {

//     //Caption for Penalty Area
//     x1 = this.canvas.width - this.penaltyArea.width + 20;
//     y1 = this.canvas.height - this.penaltyArea.height ;
//     x2 = x1 - this.common.arrowLength.Default;
//     y2 = y1;
//     ground.drawArrowLine(x1, y1, x2, y2, true );
//     this.captioinText = "Penalty Area";
//     ground.writeText(this.captioinText, x2 - 50, y2 - 10, this.common.font.Heading);

//     //Caption for Goal Area
//     x1 = this.canvas.width - this.goalArea.width/2;
//     y1 = this.canvas.height - this.goalArea.height + 60;
//     x2 = x1 - this.common.arrowLength.Pixel50;
//     y2 = y1;
//     ground.drawArrowLine(x1, y1, x2, y2, true);
//     this.captioinText = "Goal Area";
//     ground.writeText(this.captioinText, x2-50, y2 - 10, this.common.font.Heading);

//     //Caption for Penalty Arc
//     x1 = this.canvas.width -  this.penaltyArea.width -20;
//     y1 = this.canvas.height / 2;
//     x2 = x1 - this.common.arrowLength.Default;
//     y2 = y1;
//     ground.drawArrowLine(x1, y1, x2, y2, true);
//     this.captioinText = "Penalty Arc";
//     ground.writeText(this.captioinText, x2 -50, y2 - 10, this.common.font.Heading);

//     //Caption for Penalty Spot
//     x1 = this.goalArea.width / 2;
//     y1 = this.canvas.height / 2;
//     x2 = x1 + this.common.arrowLength.Pixel50;
//     y2 = y1;
//     ground.drawArrowLine(x1, y1, x2, y2, true);
//     this.captioinText = "Penalty Spot";
//     ground.writeText(this.captioinText, x2, y2 - 10, this.common.font.Heading);
// }


}

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss'
})
export class CanvasComponent implements AfterViewInit {

  @ViewChild('canvas') public canvas!: ElementRef;

  @Input() public width = window.innerWidth - 8

  @Input() public height = window.innerHeight - 8

  @Input() public widthOffset = this.width * .14

  @Input() public heightOffset = this.height * .12

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // this.height = window.innerHeight - 8
    // this.width = window.innerWidth - 8
    // this.canvas.nativeElement.height = this.height
    // this.canvas.nativeElement.width = this.width
  }

  @Input() type!: string

  private cx!: CanvasRenderingContext2D;

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d') as any;

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
    console.log('%ccanvas.component.ts line:364 this', 'color: #007acc;', this);
    switch(this.type) {

      case 'ground':
        this.groun()
        break
      case 'rpsls':
        this.rpslsField()
        break
      case 'draw':
        this.captureEvents(canvasEl);
        break
    }
  }

  groun() {
    var xPos = 0;
        var yPos = 0;
        var captioinText = "ta";
        var canvasElement = document.querySelector("canvas");
        var context = canvasElement?.getContext("2d");
        var ground = new Drawer(this.width, this.height, 0, 0);
        ground.setGroundStyles();
        setTimeout(function () {
            //First draw all corners
            ground.drawCorner(5, 5);//Left Top
            ground.drawCorner(5, ground.canvas.height - 5); //Bottom Left
            ground.drawCorner(ground.canvas.width - 5, 5); //Top Right
            ground.drawCorner(ground.canvas.width - 5, ground.canvas.height - 5); //Bottom Right

            //Now draw ground devider after 500 ms
            setTimeout(function () {
                //Half-way line
                ground.drawLine(ground.canvas.width / 2, 0, ground.canvas.width / 2, ground.canvas.height);
                captioinText = "Half-Way Line";
                xPos = (ground.canvas.width / 2) + ground.common.arrowLength.Default;
                yPos = ground.canvas.height / 6;

                //Now draw center spot
                setTimeout(function(){
                    // ground.drawArrowLine(ground.canvas.halfWidth, yPos, xPos, yPos);
                    // ground.writeText(captioinText, xPos + 10, yPos, ground.common.font.Heading);
                    ground.drawCenterSpot(ground.canvas.width / 2, ground.canvas.height / 2, ground.penaltyArc.radius);
                    ground.drawPenaltySpot(ground.canvas.width / 2, ground.canvas.height / 2, 2);

                    //Draw Team a Penaly Areas
                    setTimeout(function () {
                        //Team-A
                        captioinText = "Team - A";
                        xPos = Math.ceil((ground.canvas.width) / 4) - Math.ceil(captioinText.length / 2);
                        yPos = 20;
                        // ground.writeText(captioinText, xPos, yPos, ground.common.font.Heading, "Yellow");
                        ground.drawPenaltyArc(ground.penaltyArc.xPosition.TeamA, ground.penaltyArc.yPosition, ground.penaltyArc.radius);
                        ground.drawPenaltyArea(ground.penaltyArea.xPosition.TeamA, ground.penaltyArea.yPosition);
                        ground.drawGoalArea(ground.goalArea.xPosition.TeamA, ground.goalArea.yPositon);
                        ground.drawPenaltySpot(ground.goalArea.width / 2, ground.canvas.height / 2, 2);
                        // ground.drawCaptionForTeamA(ground);

                        ////Draw Team a Penaly Areas
                        setTimeout(function () {
                            //Team*B
                            captioinText = "Team - B";
                            xPos = ground.canvas.width - ground.canvas.width / 3.5;
                            // ground.writeText(captioinText, xPos, yPos, ground.common.font.Heading, "Yellow");
                            ground.drawPenaltyArc(ground.penaltyArc.xPosition.TeamB, ground.penaltyArc.yPosition, ground.penaltyArc.radius);
                            ground.drawPenaltyArea(ground.penaltyArea.xPosition.TeamB, ground.penaltyArea.yPosition);
                            ground.drawGoalArea(ground.goalArea.xPosition.TeamB, ground.goalArea.yPositon);
                            ground.drawPenaltySpot(ground.canvas.width - (ground.goalArea.width / 2), ground.canvas.height / 2, 2);
                            // ground.drawCaptionForTeamB(ground);

                            setTimeout(function () {
                                //Draw Captions for Center Spot
                                ground.drawArrowLine(ground.canvas.halfWidth, ground.canvas.height / 2, ground.canvas.halfWidth + ground.penaltyArc.radius * 2, ground.canvas.height / 2, false);
                                captioinText = "Center Spot";
                                xPos = ground.canvas.halfWidth + ground.penaltyArc.radius * 2;
                                yPos = (ground.canvas.height / 2) - 10;
                                // ground.writeText(captioinText, xPos, yPos, ground.common.font.Heading, "yellow");
                            }, 500);
                        }, 500);
                    }, 1000);
                },500);
            }, 500);
        }, 1000);

  }

  rpslsField() {
    console.log('%cHello canvas.component.ts line:52 ', 'background: green; color: white; display: block;', this.widthOffset, this.heightOffset);

    var ground = new Drawer(this.width, this.height, this.widthOffset, this.heightOffset);
    ground.setGroundStyles();
    ground.setRectangle(this.widthOffset, this.heightOffset);
    ground.drawLine(ground.canvas.width / 2, 0, ground.canvas.width / 2, ground.canvas.height);
    ground.drawCenterSpot(ground.canvas.width / 2, ground.canvas.height / 2, ground.penaltyArc.radius);
    ground.drawPenaltySpot(ground.canvas.width / 2, ground.canvas.height / 2, 2);

    // ground.drawPenaltyArea(ground.penaltyArea.xPosition.TeamA, ground.penaltyArea.yPosition);
    ground.drawPlayerArea(ground.playerArea.xPosition.TeamA, ground.playerArea.yPositon);
    // ground.drawPenaltySpot(ground.playerArea.width / 2 + this.widthOffset / 2, ground.canvas.height / 2, 2);
    ground.drawPlayerArea(ground.playerArea.xPosition.TeamB, ground.playerArea.yPositon);
    // ground.drawPenaltySpot(ground.canvas.width - (ground.playerArea.width / 2) - this.widthOffset / 2, ground.canvas.height / 2, 2);
    // this.cx.beginPath();
    // // outline
    // this.cx.rect(this.widthOffset, this.heightOffset, this.width - this.widthOffset * 2, this.height - this.heightOffset * 2);
    // // goals
    // this.cx.rect(this.widthOffset / 2, (this.height / 2) - (this.heightOffset), this.widthOffset / 2, this.heightOffset * 2);
    // this.cx.rect(this.width - this.widthOffset, (this.height / 2) - (this.heightOffset), this.widthOffset / 2, this.heightOffset * 2);

    // // center
    // this.cx.moveTo(this.width / 2, this.heightOffset)
    // this.cx.lineTo(this.width / 2, this.height - this.heightOffset);
    // this.cx.arc(this.width / 2, this.height / 2, 80, 0, 2 * Math.PI);

    // this.cx.stroke();
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point
              pairwise()
            )
        })
      )
      .subscribe((res: any/* [MouseEvent, MouseEvent] */) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }

}

