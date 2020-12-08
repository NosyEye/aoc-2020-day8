export { Program, Instruction, OpCode, ExitCode };

let OpCode = {
  acc : 0,
  jmp : 1,
  nop : 2
};

let ExitCode = {
  Terminated: 0,
  Looped: 1
}

class Program {
  instructions;
  accumulator;
  pc;
  linesRun;
  instructionsRun;

  constructor(instructions) {
    this.instructions = instructions;
    this.reset();
  }

  reset() {
    this.accumulator = 0;
    this.pc = 0;
    this.linesRun = [];
    this.instructionsRun = [];
  }

  run(guardLoop){
    while (true) {
      if (guardLoop) {
        if (this.linesRun.includes(this.pc)) {
          return ExitCode.Looped;
        }
      }      
      
      let inst = this.instructions[this.pc];

      if (!inst) {
        return ExitCode.Terminated;
      }

      this.linesRun.push(this.pc);
      this.instructionsRun.push(inst);

      switch (inst.opcode) {
        case OpCode.acc: 
          this.accumulator += inst.argument; 
          this.pc++;
          break;
        case OpCode.jmp: 
          this.pc += inst.argument;
          break;
        case OpCode.nop: 
          this.pc++;
          break;
        default:
          throw new Error('Unknown instruction encountered!');
      }

    }
  }
}

class Instruction {
  line;
  opcode;
  argument;

  constructor(line, operation, argument) {
    this.line = line;
    this.opcode = OpCode[operation];
    this.argument = argument;
  }

  setOperation(opcode) {
    this.opcode = opcode;
  }
}