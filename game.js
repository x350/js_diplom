'use strict';

class Vector {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  plus(objectVector) {
  	if (objectVector insstanceof Vector) {
  		return new Vector(this.x + objectVector.x, this.y + objectVector.y);
  	} else {
		throw 'Можно прибавлять к вектору только вектор типа Vector';
  	}  		
  }
}



// моя проверка.
let vec = new Vector(5, 6);
let vec_1 = new Vector(1, 1);


console.log(vec.plus(vec_1));
console.log(vec instanceof Vector);