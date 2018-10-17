// Don't use this! extending base types is bad practice!
// Array.prototype.iter = function() {
//   return iterator(this);
// }

function Seq() {};

Seq.of = function(args) {
  return iterator(args);
}

function* iterator(iterable) {
  yield* iterable;
}

iterator.prototype.map = function(fn) {
  return mapIter(fn, this);
}

iterator.prototype.filter = function(predicate) {
  return filtrator(predicate, this);
}

//recursive faster?
iterator.prototype.take = function(n) {
  return takeIter(n, this);
}

//cant make these lambdas because it doesn't bind this? "this" would be the window?
//***********Terminal Operations****************************************** */
iterator.prototype.collect = function() {
  return [...this];
}

iterator.prototype.count = function() {
  let result = 0;
  while (!this.next().done) {
    result++
  }
  return result
}


iterator.prototype.forEach = function(fn) {
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
mapIter.prototype = Object.create(iterator.prototype);

function* filtrator(predicate, iterable) {
  for (let val of iterable) {
      if (predicate(val)) {
          yield val;
      }
  }
}
filtrator.prototype = Object.create(iterator.prototype);

//test
function* takeIter(n, iterable) {
  let count = 0;
  while (count < n) { //check for done?
    yield iterable.next().value;
    count++;
  }
}
takeIter.prototype = Object.create(iterator.prototype);
