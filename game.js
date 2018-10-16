'use strict';

class Vector {
  constructor(x = 0, y = 0) {
    if ((typeof x !== 'number') || (typeof y !== 'number') || isNaN(x) || isNaN(y)) {
      throw new Error('Переданные в конструктор класса Vector параметры - не число');
    }    
    this.x = x;
    this.y = y;
  }

  plus(objectVector) {
    if (!(objectVector instanceof Vector)) {
      throw new Error('Можно прибавлять к вектору только вектор типа Vector');
    }
    return new Vector(this.x + objectVector.x, this.y + objectVector.y);     
  }

  times(multiplexor) {
    if ((typeof multiplexor !== 'number') || isNaN(multiplexor)) { 
      throw new Error('Множитель не число');
    }
    return new Vector(this.x * multiplexor, this.y * multiplexor);
  }
}

class Actor {
  constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
    if (!(pos instanceof Vector) || !(size instanceof Vector) || !(speed instanceof Vector)) {
      throw new Error('Переданные в конструктор Actor параметры не являются типиом данных Vector');
    }
    this.pos = pos;
    this.size = size;
    this.speed = speed;
  }

  act() {}

  get left() { return this.pos.x; }

  get top() { return this.pos.y; }

  get right() { return this.pos.x + this.size.x; }

  get bottom() { return this.pos.y + this.size.y; }

  get type() { return 'actor'; }

  isIntersect(objectActor) {
    if (!(objectActor instanceof Actor)) {
      throw new Error('Переданный параметр не Actor');
    }
    if (Object.is(this, objectActor)) {
      return false;
    } else {
      let xColumn = false;
      let yColumn = false;
      if ((this.right > objectActor.left) && (this.left < objectActor.right)) {
        xColumn = true;
      }
      if ((this.bottom > objectActor.top) && (this.top < objectActor.bottom)) {
        yColumn = true;
      }
      if (xColumn & yColumn) { return true; }
      return false;
    }
  }
}

class Level {
  constructor(grid = [], actorsArray = []) {
    this.grid = grid;
    this.actors = actorsArray;
    this.status = null;
    this.finishDelay = 1;
    this.player = this.actors.find(function(actor) {
      return actor.type === 'player';
    }); 
  }

  get height() { return this.grid.length; }

  get width() {
    let maxRow = 0;
    for (let row of this.grid) {
      let tempValue = (row !== undefined) ? row.length : 0;
      if (tempValue > maxRow) {
        maxRow = tempValue;
      }
    }
    return maxRow;    
  }

  isFinished() {
    return ((this.status !== null) && (this.finishDelay < 0));
  }

  actorAt(movingActor) {
    if (!(movingActor instanceof Actor)) {
      throw new Error('Переданный объект не Actor');
    }
    for (let item of this.actors) {
      if (movingActor.isIntersect(item)) return item;
    }
  }

  obstacleAt(relocation, size) {
    if (!(relocation instanceof Vector) || !(size instanceof Vector)) {  
      throw new Error('переданные в obstacleAt аргументы - не Vector');
    }  
    if ((relocation.y + size.y) >= this.height) return 'lava';
    if ((relocation.y < 0) || (relocation.x < 0) || ((relocation.x + size.x) >= this.width)) {
      return 'wall';
    }  

    let xPlace = Math.floor(relocation.x);
    let xPlaceWithSize = Math.floor(relocation.x + size.x - 0.01);      
    let yPlace = Math.floor(relocation.y + size.y - 0.01);
    if (this.grid[yPlace][xPlace] === undefined) {
      return this.grid[yPlace][xPlaceWithSize];
    } else { return this.grid[yPlace][xPlace]; }       
  }

  removeActor(objectActor) {
    const index = this.actors.indexOf(objectActor);
    if (index !== -1) {
      this.actors.splice(index, 1);
    }      
  }

  noMoreActors(typeMovingObject) {
  return this.actors.every(function(item) {
      if (item.type !== typeMovingObject) { return true; }
    });  
  }

  playerTouched(typeObjectString, TouchedObject = 0) {
    if (this.status === null) {
      if ((typeObjectString === 'lava') || (typeObjectString === 'fireball')) {
        this.status = 'lost';
      }
      if ((typeObjectString === 'coin') && (TouchedObject !== 0) && (TouchedObject.type === 'coin')) {
        this.removeActor(TouchedObject);
        if (this.noMoreActors(TouchedObject.type)) {
          this.status = 'won'; 
        }   
      }
    }
  }
}

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
        Array.from(item).map((item) => this.obstacleFromSymbol(item))
      );
    }
    return tempArray;
  }

  createActors(arrayString) {
    if (!this.actorsDict) return [];
    let actorsArray = [];
    for (let itemY = 0; itemY < arrayString.length; itemY++) {
      for (let itemX = 0; itemX < arrayString[itemY].length; itemX++) {
        let construct = this.actorFromSymbol(arrayString[itemY][itemX]);
        if (typeof construct !== 'function') continue;
        let newActorObject = new construct(new Vector(itemX, itemY));
        if (newActorObject instanceof Actor) actorsArray.push(newActorObject);
      }
    }
    return actorsArray;    
  }

  parse(arrayString) {
    return new Level(this.createGrid(arrayString), this.createActors(arrayString));
  }
}

class Fireball extends Actor {
  constructor(position = new Vector(0, 0), speed = new Vector(0, 0)) {
    super(position, new Vector(1, 1), speed);
  }

  get type() { return 'fireball'; }

  getNextPosition(time = 1) {
    return new Vector(this.pos.x + (this.speed.x * time),
      this.pos.y + (this.speed.y * time));
  }

  handleObstacle() {
    this.speed.x = this.speed.x * -1;
    this.speed.y = this.speed.y * -1;
  }

  act(time, playingField) {
    let nextPosition = this.getNextPosition(time);
    if (!playingField.obstacleAt(nextPosition, this.size)) {
      this.pos = nextPosition;
    } else {
      this.handleObstacle();     
    }
  }
}

class HorizontalFireball extends Fireball {
  constructor(position) {
    super(position, new Vector(2, 0));
  }
}

class VerticalFireball extends Fireball {
  constructor(position) {
    super(position, new Vector(0, 2));
  }
}

class FireRain extends Fireball {
  constructor(position) {
    super(position, new Vector(0, 3));
    this.startPosition = position;
  }

  handleObstacle() {
    this.pos = this.startPosition; 
  }
}

class Coin extends Actor {
  constructor(position = new Vector(0, 0)) {
    super(new Vector(0.2, 0.1).plus(position), new Vector(0.6, 0.6));
    this.springSpeed = 8;
    this.springDist = 0.07;
    this.spring = Math.random() * 2 * Math.PI;
    this.baseVector = this.pos;
  }

  get type() { return 'coin'; }

  updateSpring(time = 1) {
    this.spring += this.springSpeed * time;
  }

  getSpringVector() {
    return new Vector(0, Math.sin(this.spring) * this.springDist);
  }

  getNextPosition(time = 1) {
    this.updateSpring(time);
    this.pos = this.baseVector.plus(this.getSpringVector());
    return this.pos;
  }

  act(time) {
    this.pos = this.getNextPosition(time);
  }
}

class Player extends Actor {
  constructor(position = new Vector(0, 0)) {
    super(position.plus(new Vector(0, -0.5)), new Vector(0.8, 1.5));
  }

  get type() { return 'player'; }
}

const actorDict = {
  '@': Player,
  'v': FireRain,
  'o': Coin,
  '=': HorizontalFireball,
  '|': VerticalFireball
};

const parser = new LevelParser(actorDict);

loadLevels().then(item => runGame(JSON.parse(item), parser, DOMDisplay).then(() => alert('Вы выиграли приз!')));
