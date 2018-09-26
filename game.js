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

