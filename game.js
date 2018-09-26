'use strict';


// Реализация класса Vector.
class Vector {
  constructor (x, y) {
    if ((typeof(x) === 'number') && (typeof(y) === 'number') && !isNaN(x) && !isNaN(y)) {
    this.x = x;
    this.y = y;
  } else {
    throw 'Переданные в конструктор класса Vector параметры - не число';
  }
  }

  plus(objectVector) {
    if (objectVector instanceof Vector) {
      return new Vector(this.x + objectVector.x, this.y + objectVector.y);
    } else {
    throw 'Можно прибавлять к вектору только вектор типа Vector';
    }     
  }

  times(multiplexor) {
    if ((typeof(multiplexor) === 'number') && !(isNaN(multiplexor)) ) { 
      return new Vector(this.x * multiplexor, this.y * multiplexor);
    } else {
      throw 'Множитель не число';
    }

  }
}



// Пповерка.
try {
  const start = new Vector(30, 50);
  const moveTo = new Vector(5, 10);
  const finish = start.plus(moveTo.times(2));

  console.log(`Исходное расположение: ${start.x}:${start.y}`);
  console.log(`Текущее расположение: ${finish.x}:${finish.y}`);
} catch(err) {
  console.log(err);
}
'use strict';


// Реализация класса Vector.
class Vector {
  constructor (x, y) {
    if ((typeof(x) === 'number') && (typeof(y) === 'number') && !isNaN(x) && !isNaN(y)) {
    this.x = x;
    this.y = y;
  } else {
    throw 'Переданные в конструктор класса Vector параметры - не число';
  }
  }

  plus(objectVector) {
    if (objectVector instanceof Vector) {
      return new Vector(this.x + objectVector.x, this.y + objectVector.y);
    } else {
    throw 'Можно прибавлять к вектору только вектор типа Vector';
    }     
  }

  times(multiplexor) {
    if ((typeof(multiplexor) === 'number') && !(isNaN(multiplexor)) ) { 
      return new Vector(this.x * multiplexor, this.y * multiplexor);
    } else {
      throw 'Множитель не число';
    }

  }
}

// Реализация класса Actor.
