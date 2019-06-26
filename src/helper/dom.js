let binarySearch = function(arr, x, start, end) {
  if (start > end) return false;

  let mid = Math.floor((start + end) / 2);

  if (arr[mid] <= x && x < arr[mid + 1]) return mid;

  if (arr[mid] > x) return binarySearch(arr, x, start, mid - 1);
  else return binarySearch(arr, x, mid + 1, end);
};

export function findStyleParent(element) {
  const parentElement = element.parentElement;
  if (
    parentElement &&
    (parentElement.style.height !== "100%" ||
      parentElement.style.width !== "100%")
  ) {
    return {
      height: parseInt(parentElement.style.height, 10),
      width: parseInt(parentElement.style.width, 10)
    };
  } else {
    return findStyleParent(parentElement);
  }
}

export function findScrollValue(
  scrollValue,
  numberOfVisibleItem,
  dataLength,
  arrayValueDim
) {
  let currentIndex = binarySearch(
    arrayValueDim,
    scrollValue,
    0,
    arrayValueDim.length - 1
  );

  currentIndex =
    currentIndex - numberOfVisibleItem >= dataLength
      ? currentIndex - numberOfVisibleItem
      : currentIndex;

  let end =
    currentIndex + numberOfVisibleItem >= dataLength
      ? dataLength - 1
      : currentIndex + numberOfVisibleItem;

  return {
    start: currentIndex,
    end: end
  };
}
