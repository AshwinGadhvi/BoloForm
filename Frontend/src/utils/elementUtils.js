export const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), max);

export const percentFromEvent = (e, rect) => ({
  x: clamp((e.clientX - rect.left) / rect.width, 0, 1),
  y: clamp((e.clientY - rect.top) / rect.height, 0, 1),
});
