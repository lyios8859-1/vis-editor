import { divide, multiply } from "mathjs";

export const canvasStyleData = {
  width: 700,
  height: 600,
  scale: 100,
};

export function changeStyleWithScale(value: number) {
  return multiply(value, divide(canvasStyleData.scale, 100));
}
