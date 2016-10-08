#!/usr/bin/env node


/**
 *
 */
import createCli from 'meow';
import readPkgUp from 'read-pkg-up';
import getTaskRunner from './index';


/**
 *
 */
const cli = createCli(`
  Usage
    $ terbit <version>

    Version can be:
      patch | minor | major | prepatch | preminor | premajor | prerelease | 1.2.3

  Options
    --any-branch       Allow publishing from any branch
    --skip-cleanup     Skip cleanup of node_modules
    --skip-test        Skip cleanup and testing
    --changelog-preset Use \`conventional-changelog\`
    --tag              Publish under a given dist-tag

  Examples
    $ np patch
    $ np 1.0.2
    $ np 1.0.2-beta.3 --tag=beta
`, { boolean: ['any-branch', 'skip-cleanup', 'skip-test'] });


/**
 *
 */
async function runProgram() {
  try {
    const taskRunner = await getTaskRunner(cli.input[0], cli.flags);
    await taskRunner.run();
    const { pkg } = await readPkgUp();
    console.log(`\n ${pkg.name} ${pkg.version} published`); // eslint-disable-line no-console
  }
  catch (error) {
    console.log(`\nError: ${error.message}`); // eslint-disable-line no-console
    process.exit(1);
  }
}


/**
 *
 */
if (!module.parent) {
  runProgram();
}
