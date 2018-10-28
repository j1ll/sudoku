function getCoordinatesSet(grid){
  "use strict";
  let nums = [new Set(),new Set(),new Set(),new Set(),new Set(),new Set(),new Set(),new Set(),new Set(),new Set()];
  for(let y=0; y<9; y++){
  for(let x=0; x<9; x++) {
    //console.dir(grid[y]);
    nums[(grid[y][x])].add(""+y+x)

  }
  }
  return(nums)
};
module.exports.getCoords = getCoordinatesSet;