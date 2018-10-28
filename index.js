"use strict";
let grid3 = require("./gridList.js").grids[3];
let coordinatesSets = require("./grid_coordinates.js").getCoords(grid3);

function squareFromCoords(y,x){
  let sq = 0;  sq+= (y-(y%3)) + ((x-(x%3))/3);  return(""+sq);
}
function coordsFromSquare(s) {
  let x0 = (s%3)*3;  let y0 = s-(s%3);  return [y0,x0];
}

let testt = new Set([1,2,3,4,5,6,7,8,9]);
let resolvedNums=0;


let emptyCells = coordinatesSets[0];
class Num{
  constructor(n){
    this.value = n;
    this.possibleCells = new Set(emptyCells);
    let kP   = this.knownPositions = coordinatesSets[n];
    kP.forEach(this.deleteImpossibleCells.bind(this));

  }
  getPosRow(n){
    return [...this.possibleCells].filter(x=>x[0]==n)
  }
  getPosCol(n){
    return [...this.possibleCells].filter(x=>x[1]==n)
  }
  getPosSqu(n){
    return [...this.possibleCells].filter(x=>squareFromCoords(x[0],x[1])==n)
  }

  checkRowIntersections(){
    for (let i =0;i<9;i++){
      let r =this.getPosRow(i);
      let t = new Set();
      r.forEach(c=>{
        t.add(squareFromCoords(c[0],c[1]))
      });
      if (t.size===1){
        let coor = coordsFromSquare(t.values().next().value);
        for (let dc=0; dc<3;dc++){
          for (let dr =1;dr<3;dr++){
            let cell = ""+ (coor[0]+(i+dr)%3)+(coor[1]+dc);
            this.possibleCells.delete(cell);
          }
        }
      }
    }
  }
  checkSquIntersections(){
    for (let i =0;i<9;i++){
      let s =this.getPosSqu(i);
      let r = new Set();
      let c = new Set();
      s.forEach(cell=>{
        r.add(cell[0]);
        c.add(cell[1]);
      });
      if (r.size===1){
        let iRow = (r.values().next().value);
        for (let k=0; k<3;k++){
          for (let n =1;n<3;n++){
            let cell = ""+ iRow+(((i+n)%3)*3+k);
            this.possibleCells.delete(cell);
          }
        }
      }
      if (c.size===1){
        let iCol = (c.values().next().value);
        for (let k=3; k<9;k++){
          let cell = ""+ (((i-(i%3))+k)%9) + iCol;
          this.possibleCells.delete(cell);
        }
      }
    }
  }
  checkColIntersections(){
    for (let i =0;i<9;i++){
      let r =this.getPosCol(i);
      let t = new Set();
      r.forEach(c=>{
        t.add(squareFromCoords(c[0],c[1]))
      });
      if (t.size===1){
      debugger;
        let coor = coordsFromSquare(t.values().next().value);

        for (let dr=0; dr<3;dr++){
          for (let dc =1;dc<3;dc++){
            let cell = ""+(coor[0]+dr)+ (coor[1]+(i+dc)%3);
            debugger;
            this.possibleCells.delete(cell);
          }
        }
      }
    }
  }

  get pos(){
    let possible = {};
    possible.Rows    = [[],[],[],[],[],[],[],[],[]];
    possible.Columns = [[],[],[],[],[],[],[],[],[]];
    possible.Squares = [[],[],[],[],[],[],[],[],[]];
    this.possibleCells.forEach(c=>{
      let y = c[0], x = c[1]; let s = squareFromCoords(y,x);
      possible.Rows[y].push(c); possible.Columns[x].push(c); possible.Squares[s].push(c);
    });
    return possible;
  }

  checkIntersection(rows, cols, squs){
    let rs = rows.filter(x=>x.length<4 && x.length>0);
    let cs = cols.filter(x=>x.length<4 && x.length>0);
    let ss = squs.filter(x=>x.length<4 && x.length>0);
    rs = rs.filter(row=>{
      let s = squareFromCoords(row[0][0],row[0][1]);
      row.every(cel=>(squareFromCoords(cel[0],cel[1])===s))
    });
    cs = cs.filter(col=>{
      let s = squareFromCoords(col[0][0],col[0][1]);
      col.every(cel=>(squareFromCoords(cel[0],cel[1])===s))
    });
    let ss_c = ss.filter(squ=>{
      let c = (squ[0][1]);
      squ.every(cel=>cel[1]===c)
    });
    let ss_r = ss.filter(squ=>{
      let r = (squ[0][0]);
      squ.every(cel=>cel[0]===r)
    })
  }




  deleteImpossibleCells(pos){
    let y = pos[0];
    let x = pos[1];
    for (let i =0;i<9;i++){
      this.possibleCells.delete(y+i);
      this.possibleCells.delete(i+x);
    }
    let q = coordsFromSquare(squareFromCoords(y,x));
    for(let i =0; i<3; i++){
      for(let k =0; k<3; k++){
        this.possibleCells.delete(""+(q[0]+i)+(q[1]+k));
      }
    }

  }

  getUnambiguoslyCells(){

    let single = new Set();
    let arrays = this.pos.Rows.concat(this.pos.Columns, this.pos.Squares).forEach(
      v=> {
        if (v.length == 1){
          single.add(v[0]);
        }
      }
    );
    return single;

  }

  checkNum(){
    if(this.knownPositions.size===9){
      console.dir("YYY "+ this.value+" __ "+ [...this.knownPositions]);
      resolvedNums++;
      return false;
    }

    this.checkSquIntersections();
    this.checkRowIntersections();
    this.checkColIntersections();
    let cells = this.getUnambiguoslyCells();
    // console.dir(cells);
    cells.forEach(c=>{
      let y = c[0]; let x = c[1];
      emptyCells.delete(c);
      numsArr.forEach(s=>{
        s.possibleCells.delete(c)
      });
      grid3[y][x] = this.value;
      this.deleteImpossibleCells(c);
      this.knownPositions.add(c)

    });
      return true;

  }
}
let numsArr = [new Num(1), new Num(2), new Num(3), new Num(4), new Num(5), new Num(6), new Num(7), new Num(8), new Num(9)];




console.dir(grid3);

   console.log('');

while(numsArr.length!==0){
  numsArr = numsArr.filter(x=>
    x.checkNum()
  );
}
console.dir(grid3);
