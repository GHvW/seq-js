// Don't use this! extending base types is bad practice!
// Array.prototype.iter = function() {
//   return sequence(this);
// }

function Seq() {};

Seq.of = function(args) {
  return sequence(args);
}

function* sequence(iterable) {
  yield* iterable;
}

sequence.prototype.map = function(fn) {
  return mapIter(fn, this);
}

sequence.prototype.flatten = function() {
  return flattenIter(this);
}

sequence.prototype.flatMap = function(fn)  {
  return flatMapIter(fn, this);
}

sequence.prototype.filter = function(predicate) {
  return filtrator(predicate, this);
}

//recursive faster?
sequence.prototype.take = function(n) {
  return takeIter(n, this);
}

sequence.prototype.takeWhile = function(predicate) {
  return takeWhileIter(predicate, this);
}

sequence.prototype.skip = function(n) {
  return skipIter(n, this);
}

sequence.prototype.skipWhile = function(predicate) {
  return skipWhileIter(predicate, this);
}

sequence.prototype.zip = function(seq) {
  return ziperator(seq, this);
}

sequence.prototype.enumerate = function() {
  return enumerateIter(this);
}

//cant make these lambdas because it doesn't bind this? "this" would be the window?
//***********Terminal Operations****************************************** */
sequence.prototype.collect = function() {
  return [...this];
}

sequence.prototype.count = function() {
  let result = 0;
  while (!this.next().done) {
    result++
  }
  return result
}


sequence.prototype.forEach = function(fn) {
  for (let val of this) {
    fn(val);
  }
}

//sometimes called fold
sequence.prototype.reduce = function(fn, val) {
  let next = this.next();
  if (next.done) {
    return val;
  }
  return this.reduce(fn, fn(val, next.value));
}

//*******************Iterators************************* */
function* mapIter(fn, iterable) {
  for (let val of iterable) {
      yield fn(val);
  }
}
mapIter.prototype = Object.create(sequence.prototype);

function* flattenIter(iterableOfIterables) {
  for (let iter of iterableOfIterables) {
    for (let val of iter) {
      yield val;
    }
  }
}
flattenIter.prototype = Object.create(sequence.prototype);

function* flatMapIter(fn, iterable) {
  for (let val of iterable) {
    for (let innerVal of fn(val)) {
      yield innerVal;
    }
  }
}
flatMapIter.prototype = Object.create(sequence.prototype);

function* filtrator(predicate, iterable) {
  for (let val of iterable) {
      if (predicate(val)) {
          yield val;
      }
  }
}
filtrator.prototype = Object.create(sequence.prototype);

//test
function* takeIter(n, iterable) {
  for (let i = 0; i < n; i++) { //check for done?
    yield iterable.next().value;
  }
}
takeIter.prototype = Object.create(sequence.prototype);

function* takeWhileIter(predicate, iterable) {
  let next = iterable.next();
  while (predicate(next.value)) {
    yield next.value;
    next = iterable.next();
  }
}
takeWhileIter.prototype = Object.create(sequence.prototype);

function* skipIter(n, iterable) {
  for (let i = 0; i < n; i++) {
    iterable.next();
  }
  for (let val of iterable) {
    yield val;
  }
}
skipIter.prototype = Object.create(sequence.prototype);

function* skipWhileIter(predicate, iterable) {
  let next = iterable.next().value;
  while (predicate(next)) {
    next = iterable.next().value;
  };
  yield next;

  for (let val of iterable) {
    yield val;
  }
}
skipWhileIter.prototype = Object.create(sequence.prototype)

//will require array style access x[0], x[1] to access values
function* ziperator(sequence, iterable) {
  let first = iterable.next();
  let second = sequence.next();
  while (!first.done && !second.done) {
    yield { 0: first.value, 1: second.value };
    first = iterable.next();
    second = sequence.next();
  }
}
ziperator.prototype = Object.create(sequence.prototype);

function* enumerateIter(iterable) {
  let count = 0;
  for (let val of iterable) {
    yield { i: count, value: val };
    count += 1;
  }
}
enumerateIter.prototype = Object.create(sequence.prototype);

module.exports = Seq;
