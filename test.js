    "use strict";
    function checkSquRowIntersections(){
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