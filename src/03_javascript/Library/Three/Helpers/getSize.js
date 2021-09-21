import { Box3, Vector2 } from "three"

export default function(mesh) {
  const rect = new Vector2()
  const box = new Box3().setFromObject(mesh)
  box.getSize(rect)
  return rect
}