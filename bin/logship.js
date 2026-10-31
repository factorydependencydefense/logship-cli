#!/usr/bin/env node
const { readFileSync } = require('node:fs');
const { groupByService, servicesSeen, worstFirst } = require('../src/logs.js');

const COMMANDS = ['group', 'services', 'worst'];

function run(argv, write = console.log) {
  const [command, file] = argv;
  if (!command || !file) {
    write(`usage: logship <${COMMANDS.join('|')}> <file>`);
    return 1;
  }
  if (!COMMANDS.includes(command)) {
    write(`unknown command: ${command}`);
    return 1;
  }
  const lines = readFileSync(file, 'utf8').split('\n').filter(Boolean);
  if (command === 'group') write(JSON.stringify(groupByService(lines), null, 2));
  else if (command === 'services') write(servicesSeen(lines).join('\n'));
  else write(worstFirst(lines).map((e) => `${e.level} ${e.message}`).join('\n'));
  return 0;
}

module.exports = { run };

if (require.main === module) {
  process.exit(run(process.argv.slice(2)));
}
