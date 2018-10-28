const Seq = require("../src/sequence");


let arr = [1, 2, 3];
let bigArr = [1, 2, 3, 4, 5, 6];

test("test sequence: converts Array to Sequence", () => {
  let seq = Seq.of(arr);

  expect(seq.next().value).toBe(1);
  expect(seq.next().value).toBe(2);
  expect(seq.next().value).toBe(3);
  expect(seq.next().value).toBe(undefined);
});

test("test map: maps each element of a sequence to it's square", () => {
  let seq = Seq.of(arr).map(x => x * x);

  expect(seq.next().value).toBe(1);
  expect(seq.next().value).toBe(4);
  expect(seq.next().value).toBe(9);
  expect(seq.next().value).toBe(undefined);
});

test("test flatten: flattens a 2d array to a 1d array of the same elements", () => {
  let twoD = [[1], [2], [3]];
  let seq = Seq.of(twoD).flatten();

  expect(seq.next().value).toBe(1);
  expect(seq.next().value).toBe(2);
  expect(seq.next().value).toBe(3);
  expect(seq.next().value).toBe(undefined);
});

test("test filter: filter odds out of the sequence", () => {
  let seq = Seq.of(arr).filter(x => x % 2 === 0);

  expect(seq.next().value).toBe(2);
  expect(seq.next().value).toBe(undefined);
});

test("test flatMap: map a 2d array of X's to a 2d array of X, Y and flatten it", () => {
  let twoD = [["X"], ["X"], ["X"]];
  let seq = Seq.of(twoD).flatMap(x => x.concat("Y"));

  expect(seq.next().value).toBe("X");
  expect(seq.next().value).toBe("Y");
  expect(seq.next().value).toBe("X");

  let counter = 0;
  for (let val of seq) {
    counter++
  }
  expect(counter).toBe(3);
  expect(seq.next().value).toBe(undefined);
});

test("test collect (to Array): in 1, 2, 3, 4, 5, 6, filter evens, map to it's double, collect to array", () => {
  let newArr = Seq.of(bigArr).filter(x => x % 2 === 0).map(x => x * 2).collect();

  expect(newArr).toEqual([4, 8, 12]);
});

test("test take: in 1, 2, 3, 4, 5, 6, take the first 3 numbers", () => {
  let seq = Seq.of(bigArr).take(3);

  expect(seq.next().value).toBe(1);
  expect(seq.next().value).toBe(2);
  expect(seq.next().value).toBe(3);
  expect(seq.next().value).toBe(undefined);
});

test("test takeWhile: take until applied predicate is false", () => {
    let seq = Seq.of(bigArr).takeWhile(x => x < 2);

    expect(seq.next().value).toBe(1);
    expect(seq.next().value).toBe(undefined);
});

test("test forEach: for each value in the sequence add to a total, consuming the sequence", () => {
  let seq = Seq.of(bigArr);
  let total = 10;

  seq.forEach(x => {
    total += x;
  });

  expect(total).toBe(31);
  expect(seq.next().value).toBe(undefined);
});

test("test count: get the number of values in a sequence, consuming the sequence", () => {
  let seq = Seq.of(bigArr);
  let count = seq.count();

  expect(count).toBe(6);
  expect(seq.next().value).toBe(undefined);
});

test("test reduce: apply the function to each element, producing an accumulated value", () => {
  let sum = Seq.of(bigArr).reduce((acc, x) => acc + x, 0);

  expect(sum).toBe(21);
});

test("test skip: skip n elements of the sequence, consuming them", () => {
  let seq = Seq.of(bigArr).skip(4);

  expect(seq.next().value).toBe(5);
  expect(seq.next().value).toBe(6);
  expect(seq.next().value).toBe(undefined);
});

test("test skipWhile: skip until predicate satisfied, consuming skipped values", () => {
  let seq = Seq.of(bigArr).skipWhile(x => x < 5);

  expect(seq.next().value).toBe(5);
  expect(seq.next().value).toBe(6);
  expect(seq.next().value).toBe(undefined);
});

test("test zip: takes an iterator returns a new iterator that iterates over both at the same time", () => {
  let one = [1, 2, 3];
  let two = [4, 5, 6];
  let seq = Seq.of(one).zip(Seq.of(two));

  expect(seq.next().value).toEqual({ 0: 1, 1: 4});
  expect(seq.next().value).toEqual({ 0: 2, 1: 5 });
  expect(seq.next().value).toEqual({ 0: 3, 1: 6 });
  expect(seq.next().value).toBe(undefined);
});

test("test enumerate: will create an iterator that includes the current iteration count as well as the next value", () => {
  let seq = Seq.of(arr).enumerate();

  expect(seq.next().value).toEqual({ i: 0, value: 1 });
  expect(seq.next().value).toEqual({ i: 1, value: 2 });
  expect(seq.next().value).toEqual({ i: 2, value: 3 });
  expect(seq.next().value).toBe(undefined);
});

test("test nth: return the nth element from the sequence", () => {
  let seq = Seq.of(arr).nth(1);

  expect(seq.next().value).toBe(2);
  expect(seq.next().value).toBe(undefined);
});

// test("test peekable: allows access to the next value in the sequence without consuming it", () => {
//   let seq = Seq.of(arr).peekable();

//   expect(seq.peek().value).toBe(1);
//   expect(seq.next().value).toBe(1);
//   expect(seq.peek().value).toBe(2);
//   expect(seq.peek().value).toBe(2);
//   expect(seq.next().value).toBe(2);
//   expect(seq.next().value).toBe(3);
//   expect(seq.next().value).toBe(undefined);

//   let secondSeq = Seq.of(bigArr).peekable();

//   expect(secondSeq.next().value).toBe(1);
//   expect(secondSeq.peek().value).toBe(2);

//   let next = 2;
//   for (let val of secondSeq) {
//     expect(val).toBe(next);
//     next += 1;
//   }

//   let testPeek = Seq.of(arr).peekable().max();
//   expect(testPeek).toBe(3);
// });

test("test partition: consumes the sequence creating two lists. one with values that satisfy the predicate and one with values that do not", () => {
  let part = Seq.of(bigArr).partition(x => x % 2 === 0);

  expect(part[0]).toEqual([2, 4, 6]);
  expect(part[1]).toEqual([1, 3, 5]);
});

test("test any: tests whether any values match the predicate, returns true if so, false if not. Short circuits on match leaving the rest unconsumed", () => {
  let seq = Seq.of(bigArr);

  expect(seq.any(x => x % 2 === 0)).toBe(true);
  expect(seq.next().value).toBe(3);
});

test("test min: returns the min value of the sequence, consuming the sequence", () => {
  let min = Seq.of(arr).min();

  expect(min).toBe(1);
});

test("test max: returns the max value of the sequence, consuming the sequence", () => {
  let max = Seq.of(arr).max();

  expect(max).toBe(3);
});

// test("test unzip:", () => {

// });

test("test minByKey: returns the element that gives the min value from the function", () => {
  let min = Seq.of(bigArr).minByKey(x => x * -x);

  expect(min).toBe(6)
});

test("test maxByKey: returns the element that gives the max value from the function", () => {
  let max = Seq.of(bigArr).maxByKey(x => x - 2 * x);

  expect(max).toBe(1);
});

test("test sum: returns the sum of all values in the sequence, consuming the sequence", () => {
  let sum = Seq.of(arr).sum();

  expect(sum).toBe(6);
});

test("test product: returns the product of all values in the sequence, consuming the sequence", () => {
  let product = Seq.of(arr).product();

  expect(product).toBe(6);
});

// test("test cycle: repeats the sequence endlessly", () => {
//   let seq = Seq.of(arr);

//   for (let i = 0; i < 8; i++) {
//     seq.next();
//   }
//   expect(seq.next().value).toBe(3);
// });

test("test all: tests if all values of the sequence matches the given predicate. Short circuits on false value", () => {
  let seq1 = Seq.of(arr);
  let result1 = seq1.all(x => x < 10);

  expect(result1).toBe(true);
  expect(seq1.next().value).toBe(undefined);

  let seq2 = Seq.of(arr);
  let result2 = seq2.all(x => x < 2);

  expect(result2).toBe(false);
  expect(seq2.next().value).toBe(3);
});

test("test find: finds a value that satisfies the given predicate and returns it. Does not consume the rest of the sequence", () => {
  let seq = Seq.of(arr)
  let val = seq.find(x => x === 2);

  expect(val).toBe(2);
  expect(seq.next().value).toBe(3);
  expect(seq.next().value).toBe(undefined);
});

test("test position:", () => {
  let index = Seq.of(arr).position(x => x === 2);

  expect(index).toBe(1);
});

test("test chain:", () => {
  let arr1 = [0, 2];
  let arr2 = [4];
  let seq = Seq.of(arr1).chain(Seq.of(arr2));

  expect(seq.next().value).toBe(0);
  expect(seq.next().value).toBe(2);
  expect(seq.next().value).toBe(4);
  expect(seq.next().value).toBe(undefined);
});

test("test prototype: check prototype chain of each method", () => {
  let seq =
    Seq.of(bigArr)
      .map(x => x)
      .filter(x => x !== 100)
      .takeWhile(x => x < 100)
      .skipWhile(x => x < 0)
      .skip(0)
      .take(6)
      .map(x => [[x]])
      .flatten()
      .flatMap(x => x.concat(x))
      // .peekable()
      .collect();

  expect(seq).toEqual([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);

  let zipped = Seq.of(bigArr).zip(Seq.of(arr)).filter(x => x[0] === 3 && x[1] === 3);
  expect(zipped.next().value).toEqual({ 0: 3, 1: 3 });

  let enumerated = Seq.of(arr).enumerate().filter(x => x.i === 0);
  expect(enumerated.next().value).toEqual({ i: 0, value: 1 });
  
  let nth = Seq.of(arr).nth(1).map(x => x + 1);
  expect(nth.next().value).toBe(3);

  let sec = [4, 5, 6];
  let chain = Seq.of(arr).chain(Seq.of(sec)).nth(5);
  expect(chain.next().value).toBe(6);
});
