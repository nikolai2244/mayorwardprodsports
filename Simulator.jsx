
import { useState } from 'react';
import { runFullSimulation } from '../simulator';

export default function SimulatorPage(){
  const [result,setResult]=useState(null);
  async function simulate(){
    setResult(await runFullSimulation('TeamA','TeamB'));
  }
  return <div>
    <h1>Simulator</h1>
    <button onClick={simulate}>Run Simulation</button>
    {result && <pre>{JSON.stringify(result,null,2)}</pre>}
  </div>;
}
