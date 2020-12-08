import { Program } from './program.js';
import { tokenize, parse } from './lexer-parser.js';

export { compile };

function compile(programFileContent) {
  let tokens = tokenize(programFileContent);
  let instructions = parse(tokens);
  let program = new Program(instructions);

  return program;
}