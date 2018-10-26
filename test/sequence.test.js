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

test("test peekable:", () => {

});

test("test partition:", () => {

});

test("test any:", () => {

});

test("test min:", () => {
  let min = Seq.of(arr).min();

  expect(min).toBe(1);
});

test("test max:", () => {
  let max = Seq.of(arr).max();

  expect(max).toBe(3);
});

test("test unzip:", () => {

});

test("test minBy:", () => {

});

test("test maxBy:", () => {

});

test("test sum:", () => {

});

test("test product:", () => {
  
});

test("test cycle:", () => {

});

test("test all:", () => {

});

test("test find:", () => {
  
});

test("test position:", () => {

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
