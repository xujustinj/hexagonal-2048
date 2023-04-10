// Mathematical constants.

const SIN_60 = Math.sqrt(3) / 2; // sin(PI / 3)
const COS_60 = 1 / 2; // cos(PI / 3)

function minBy(items, f) {
  // Returns the item with the minimum value of f.
  if (items.length === 0) {
    return undefined;
  }

  var minItem = items[0];
  var minValue = f(minItem);
  for (const item of items.slice(1)) {
    const value = f(item);
    if (value < minValue) {
      minItem = item;
      minValue = value;
    }
  }

  return minItem;
}

function sample(items, k) {
  // Randomly samples up to k items. Does not preserve the original list.
  const n = items.length;

  if (n <= k) {
    return items;
  }

  // If k > n/2 then it is easier to select n-k elements to be excluded.
  const invert = k > n / 2;
  const m = invert ? n - k : k;
  for (let i = 0; i < m; i++) {
    const j = Math.floor(Math.random() * (n - i));
    const temp = items[i];
    items[i] = items[j];
    items[j] = temp;
  }
  return invert ? items.slice(m) : items.slice(0, m);
}

function radians(deg) {
  // Converts degrees to radians.
  return deg * (Math.PI / 180);
}

function differenceRad(rad1, rad2) {
  // The absolute difference between two angles in radians.
  const diff = Math.abs(rad1 - rad2) % (2 * Math.PI);
  return diff < Math.PI ? diff : 2 * Math.PI - diff;
}

function assert(condition) {
  if (!condition) {
    throw new Error("Assertion failed");
  }
}

function exp2(n) {
  return 1 << n;
}

function now() {
  // The current time in seconds.
  return new Date().getTime() / 1000;
}

function setsEqual(a, b) {
  // Whether the sets are equal.
  // https://stackoverflow.com/a/31129384
  assert(a instanceof Set);
  assert(b instanceof Set);
  return a.size === b.size && [...a].every((item) => b.has(item));
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
