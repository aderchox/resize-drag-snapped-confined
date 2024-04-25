function getContentWidth(element) {
  let widthWithPaddings = element.clientWidth;
  const elementComputedStyle = window.getComputedStyle(element, null);
  return (
    widthWithPaddings -
    parseFloat(elementComputedStyle.paddingLeft) -
    parseFloat(elementComputedStyle.paddingRight)
  );
}

function clamp(x, lo, hi) {
  return x < lo ? lo : x > hi ? hi : x;
}

export { getContentWidth, clamp };
