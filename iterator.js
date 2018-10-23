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

sequence.prototype.filter = function(predicate) {
  return filtrator(predicate, this);
}

//recursive faster?
sequence.prototype.take = function(n) {
  return takeIter(n, this);
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



//*******************Iterators************************* */
function* mapIter(fn, iterable) {
  for (let val of iterable) {
      yield fn(val);
  }
}
mapIter.prototype = Object.create(sequence.prototype);

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
