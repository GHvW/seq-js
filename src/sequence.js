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

sequence.prototype.nth = function(n) {
  return ntherator(n, this);
}

sequence.prototype.chain = function(seq) {
  return chainerator(seq, this);
}

sequence.prototype.any = function(predicate) {
  return anyIter(predicate, this);
}

// sequence.prototype.peekable = function() {
//   return peekableIter(this);
// }

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

function* ntherator(n, iterable) {
  let count = 0;
  for (let val of iterable) {
    if (count === n) {
      yield val;
    }
    count += 1;
  }
}
ntherator.prototype = Object.create(sequence.prototype);

function* chainerator(seq, iterable) {
  for (let val of iterable) {
    yield val;
  }
  for (let val of seq) {
    yield val;
  }
}
chainerator.prototype = Object.create(sequence.prototype);

// function* cycleIter(iterable) {

// }
// cycleIter.prototype = Object.create(sequence.prototype);

//not chainable at the moment
// function peekableIter(iterable) {
//   let _next = undefined;
//   let _nextCount = 0;
//   let _peekCount = 0;
//   return {
//     next() {
//       if (_nextCount < _peekCount) {
//         _nextCount += 1;
//         //assertEqual(_nextCount, _peekCount); shoudl be true at this point
//       } else {
//         _next = iterable.next();
//         _nextCount += 1;
//         _peekCount += 1;
//       }
//       return _next;
//     },
//     peek() {
//       if (_nextCount === _peekCount) {
//         _peekCount += 1;
//         _next = iterable.next();
//       }
//       return _next;
//     },
//     *[Symbol.iterator]() {
//       if (_nextCount !== _peekCount) {
//         _nextCount += 1;
//         //assertEqual(_nextCount, _peekCount); should be true at this point
//         yield _next.value;
//       }
//       yield* iterable;
//     } 
//   }
// }
// peekableIter.prototype = Object.create(sequence.prototype);

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

//look into this one later
sequence.prototype.min = function() {
  let next = this.next()
  let currMin = next.value;
  while (!next.done) {
    if (next.value < currMin) {
      currmin = next.value;
    }
    next = this.next();
  }
  return currMin;
}

sequence.prototype.max = function() {
  let next = this.next();
  let currMax = next.value;
  while (!next.done) {
    if (next.value > currMax) {
      currMax = next.value;
    }
    next = this.next();
  }
  return currMax;
}

sequence.prototype.partition = function(predicate) {
  let part = { 0: [], 1: [] };
  for (let val of this) {
    if (predicate(val)) {
      part[0].push(val);
    } else {
      part[1].push(val);
    }
  }
  return part;
}

sequence.prototype.any = function(predicate) {
  let next = this.next();
  while (!next.done && !predicate(next.value)) {
    next = this.next();
  }
  return predicate(next.value); //look into this one
}

sequence.prototype.minByKey = function(fn) {
  let currMin = this.next().value;
  for (let val of this) {
    if (fn(currMin) > fn(val)) {
      currMIn = val;
    }
  }
  return currMIn;
}

sequence.prototype.maxByKey = function(fn) {
  let currMax = this.next().value;
  for (let val of this) {
    if (fn(currMax) < fn(val)) {
      currMax = val;
    }
  }
  return currMax;
}

//rework to work with other types?
sequence.prototype.sum = function() {
  let acc = 0;
  for (let val of this) {
    acc += val;
  }
  return acc;
}

//rework to work with other types?
sequence.prototype.product = function() {
  let acc = 1;
  for(let val of this) {
    acc *= val;
  }
  return acc;
}

sequence.prototype.find = function(predicate) {
  let next = this.next();
  if (!next.done && !predicate(next.value)) {
    next = this.next();
  }
  return next.value;
}

sequence.prototype.all = function(predicate) {
  let next = this.next();
  while (!next.done) {
    if (!predicate(next.value)) {
      return false
    }
    next = this.next();
  }
  return true;
}

module.exports = Seq;
