export const findStyleParent = element => {
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
};
