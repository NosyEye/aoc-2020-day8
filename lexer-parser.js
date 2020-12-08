import { Instruction } from './program.js';

export { tokenize, parse };

function tokenize(program) {
  let lines = program.split('\r\n')
  
  let tokens = [];
  lines.forEach(l => {
    tokens = tokens.concat(l.split(' '));
  });
  
  return tokens;
}

function parse(tokens) {
  let instructions = [];

  let tokenCount = 0;
  let line = 0;
  while (tokenCount < tokens.length) {    
    let operation = tokens[tokenCount];
    let argument = parseInt(tokens[tokenCount + 1]);
    instructions.push(new Instruction(line, operation, argument));

    tokenCount += 2;
    line++;
  }

  return instructions;
}