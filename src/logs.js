const _ = require('@factorydependencydefense/lodash-lite');

function parseLine(line) {
  const [service, level, ...rest] = line.split(' ');
  return { service, level, message: rest.join(' ') };
}

function groupByService(lines) {
  return _.groupBy(lines.map(parseLine), 'service');
}

function servicesSeen(lines) {
  return _.uniq(lines.map((line) => parseLine(line).service));
}

function worstFirst(lines) {
  const rank = { error: 0, warn: 1, info: 2 };
  return _.sortBy(lines.map(parseLine), (entry) => rank[entry.level] ?? 9);
}

module.exports = { parseLine, groupByService, servicesSeen, worstFirst };
