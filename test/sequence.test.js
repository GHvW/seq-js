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
})
