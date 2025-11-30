
export function simulateProp(player, type){
  return {
    player,
    type,
    probability: Number((Math.random()*0.6+0.2).toFixed(3))
  };
}

export function combineParlay(legs){
  let p = legs.reduce((acc,l)=> acc * l.probability, 1);
  return { legs, combinedProbability: Number(p.toFixed(4)) };
}
