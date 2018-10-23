const Seq = require("../src/sequence");

test("converts Array to Sequence", () => {
  let arr = [1, 2, 3];
  let seq = Seq.of(arr);

  expect(seq.next().value).toBe(1);
  expect(seq.next().value).toBe(2);
  expect(seq.next().value).toBe(3);
  expect(seq.next().value).toBe(undefined);
});