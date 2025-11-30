
import { useState } from 'react';
import { simulateProp, combineParlay } from '../parlay/engine';

export default function ParlayBuilder(){
  const [legs,setLegs]=useState([]);
  const [result,setResult]=useState(null);

  function addLeg(){
    const leg = simulateProp("Sample Player","ANY");
    setLegs([...legs,leg]);
  }

  function runParlay(){
    setResult(combineParlay(legs));
  }

  return <div>
    <h1>Parlay Builder</h1>
    <button onClick={addLeg}>Add Leg</button>
    <button onClick={runParlay}>Simulate Parlay</button>
    <pre>{JSON.stringify(result,null,2)}</pre>
  </div>;
}
