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
