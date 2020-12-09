import { compile } from './aoc-compiler.js';
import { Program, OpCode, ExitCode } from './program.js';

export async function compileAndRun() {
  let programFile = document.querySelector('#program-input').files[0];
  let programFileContents = await programFile.text();
  let program = compile(programFileContents);

  let br = '<br>';
  let out = document.querySelector('#output');
  out.innerHTML = '';
  let programExitCode = program.run(true);
  try {
    out.innerHTML += programExitCode === ExitCode.Terminated ? 'Program terminated correctly.' : 'Program entered an infinite loop.'; 
  } catch (e) {
    out.innerHTML += e;
  }

  out.innerHTML += br + 'Final accumulator is ' + program.accumulator;
  if (programExitCode === ExitCode.Terminated) {
    return;
  }

  // F I X   T H E   L O O P

  // Since we already encountered an infinite loop. The instruction we must fix must be among those jmp's and nop's we've run.
  let jmpsAndNops = program.instructionsRun.filter(inst => inst.opcode === OpCode.jmp || inst.opcode === OpCode.nop);
  
  let loopFixed = false;
  let finalAcc;
  let candidate;
  while (!loopFixed || jmpsAndNops === []){
    program.reset();

    candidate = jmpsAndNops[0];

    let originalOperation = candidate.opcode;

    if (candidate.opcode === OpCode.jmp) {
      program.instructions[candidate.line].setOperation(OpCode.nop);
    }
    else if (candidate.opcode === OpCode.nop) {
      program.instructions[candidate.line].setOperation(OpCode.jmp);
    }
    
    let moddedProgramExitCode = program.run(true);

    // If correct termination and pc ended up just after the last instruction, we did good.
    if (moddedProgramExitCode === ExitCode.Terminated && program.pc === program.instructions.length) {
      loopFixed = true;
      finalAcc = program.accumulator;
    }
    else {
      program.instructions[candidate.line].setOperation(originalOperation);
    }

    jmpsAndNops = jmpsAndNops.slice(1);
  }

  out.innerHTML += br + 'Loop fixed.' + br + 'Faulty line was line ' + (candidate.line + 1) + br + 'Final accumulator was ' + finalAcc;
}