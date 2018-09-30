'use strict';


// Реализация класса Vector.
class Vector {
  constructor (x=0, y=0) {
    if ((typeof(x) === 'number') && (typeof(y) === 'number') && !isNaN(x) && !isNaN(y)) {
    this.x = x;
    this.y = y;
  } else {
    throw(new Error('Переданные в конструктор класса Vector параметры - не число'));
  }
  }

  plus(objectVector) {
    if (objectVector instanceof Vector) {
      return new Vector(this.x + objectVector.x, this.y + objectVector.y);
    } else {
    throw(new Error('Можно прибавлять к вектору только вектор типа Vector'));
    }     
  }

  times(multiplexor) {
    if ((typeof(multiplexor) === 'number') && !(isNaN(multiplexor)) ) { 
      return new Vector(this.x * multiplexor, this.y * multiplexor);
    } else {
      throw(new Error('Множитель не число'));
    }

  }
}


// Реализация класса Actor.
class Actor {
  constructor(pos=new Vector(0,0), size=new Vector(1,1), speed=new Vector(0,0)) {
    if ((pos instanceof Vector) && (size instanceof Vector) && (speed instanceof Vector)) {
      this.pos = pos;
      this.size = size;
      this.speed = speed;
    } else {
      throw(new Error('Переданные в конструктор Actor параметры не являются типиом данных Vector'));
    }
  }

  act() {}

  get left() {return this.pos.x;}

  get top() {return this.pos.y;}

  get right() {return this.pos.x + this.size.x;}

  get bottom() {return this.pos.y + this.size.y;}

  get type() {return 'actor'; }

  isIntersect(objectActor) {
    if (objectActor instanceof Actor ) {
      if(Object.is(this, objectActor )) {
        return false;
      } else {
        // проверка, пересекаются ли.
        let XColl=false;
        let YColl=false;
        if ((this.right > objectActor.left) && (this.left < objectActor.right))  {
          XColl=true;
        }
        if ((this.bottom > objectActor.top) && (this.top < objectActor.bottom)) {
          YColl=true;
        }
        if (XColl&YColl){return true;}
        return false;
      }
    } else {throw(new Error('Переданный параметр не Actor'));}
  }
}

// Реализация класса Level.
class Level {
  constructor(grid=[], actorsArray=[]) {
    this.grid = grid;
    this.actors = actorsArray;
    for(let item of this.actors){
      if (item.type === 'player') {
        this.player = item;
        return;
      }
    }
    this.height = this.grid.length;
    let maxRow = 0;
    for(let row of this.grid) {
      let tempValue = (row !== undefined) ? row.length : 0;
      if (tempValue > maxRow) {
        maxRow = tempValue;
      }
    }
    this.width = maxRow;
    this.status = null;
    this.finishDelay = 1;
  }

  isFinished() {
    return ((this.status !== null) && (this.finishDelay < 0))
  }

  actorAt(movingActor) {
    if (movingActor instanceof Actor) {
      for(let item of this.actors) {
        if(movingActor.isIntersect(item)) return item;
      }
    } else {
      throw(new Error('Переданный объект не Actor'))
    }
  }

  obstacleAt(relocation, size) {
    if ((relocation instanceof Vector) && (size instanceof Vector)) {    
      if ((relocation.y + size.y ) > this.height) return 'lava';
      if ((relocation.y < 0) || (relocation.x < 0) || ((relocation.x + size.x ) > this.width)) {
        return 'wall';
      }
      for(let i = Math.floor(relocation.x); i < relocation.x + size.x ; i++) {
        for(let j = Math.floor(relocation.y); j < relocation.y + size.y; j++) {
          if(this.grid[j][i]) return this.grid[j][i];
        }
      }
    } else {
      throw(new Error('переданные в obstacleAt аргументы - не Vector'));
    }
  }

  removeActor(objectActor) {
      let index = this.actors.indexOf(objectActor);
      if (index !== -1) {
       this.actors.splice(index, 1);
       }      
  }

  noMoreActors(typeMovingObject) {
    for (let item of this.actors) {
      if (typeMovingObject === item.type) return false;
    }
    return true;
  }

  playerTouched(typeObjectString, TouchedObject=0) {
    if (this.status !== null) return;
    if ((typeObjectString === 'lava') || (typeObjectString === 'fireball')) {
      this.status = 'lost';
      return;
    }
    if ((typeObjectString === 'coin') && (TouchedObject !== 0) && (TouchedObject.type === 'coin')) {
      this.removeActor(TouchedObject);
    }
    if (this.noMoreActors(TouchedObject.type)) this.status = 'won';
  }
}


// Реализация LevelParser.

class LevelParser {
  constructor(actorsDict){
    this.actorsDict = actorsDict;
  }

  actorFromSymbol(actorSymbol) {
    if (actorSymbol && (actorSymbol in this.actorsDict)) {
      return this.actorsDict[actorSymbol];
    } 
  }

  obstacleFromSymbol(obstacleSymbol) {
    if (obstacleSymbol === 'x') return 'wall';
    if (obstacleSymbol === '!') return 'lava';
  }

  createGrid(arrayString) {
    let tempArray = [];
    for (let item of arrayString) {
      tempArray.push(
          Array.from(item).map(
            function(element) {
              if (element === 'x') return 'wall';
              if (element === '!') {
                return 'lava'
              } else {
                return undefined;
              }
            }
          )
        )
    }
    return tempArray;
  }

  createActors() {}

  parse() {}
}


class Fireball extends Actor {
  constructor() {}

  getNextPosition() {}

  handleObstacle() {}

  act() {}
}

class HorizontalFireball {
  constructor() {}
}

class VerticalFireball {
  constructor() {}
}

class FireRain {
  constructor() {}
}

class Coin extends Actor {
  constructor() {
    this.type = 'coin';
  }

  updateSpring() {}

  getSpringVector() {}

  getNextPosition() {}

  act(time) {}
}

class Player extends Actor{
  constructor() {}
}
