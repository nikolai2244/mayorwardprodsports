
import {runSimulationPass, blendResults} from './engine';

export async function runFullSimulation(teamA, teamB){
  const p1 = runSimulationPass(teamA, teamB, 1500000);
  const p2 = runSimulationPass(teamA, teamB, 5888);
  const p3 = runSimulationPass(teamA, teamB, 200);
  const p4 = runSimulationPass(teamA, teamB, 50);
  return blendResults(p1,p2,p3,p4);
}
