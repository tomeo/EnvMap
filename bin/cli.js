#!/usr/bin/env node
const meow = require('meow');
const envmap = require('../src');
const cli = meow(`
    Usage
      $ envmap <confPath> <outPath>
 
    Examples
      $ envmap unicorns --rainbow
      ðŸŒˆ unicorns ðŸŒˆ
`, {});

const [confPath, outPath] = cli.input;
envmap(confPath, outPath).then(() => console.log(`Wrote file ${outPath}`));





