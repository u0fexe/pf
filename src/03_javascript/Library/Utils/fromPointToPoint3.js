export default function (object, p1, p2, progress) {
  object.x = p1.x + (p2.x - p1.x) * progress
  object.y = p1.y + (p2.y - p1.y) * progress
  object.z = p1.z + (p2.z - p1.z) * progress
}