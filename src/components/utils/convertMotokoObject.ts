export function convertMotokoObject(obj: any) {
  return { id: obj[0], ...obj[1] };
}
export function convertSquadPlayer(obj: any) {
  return { id: obj[0], ...obj[1], isSub: obj[2] };
}
