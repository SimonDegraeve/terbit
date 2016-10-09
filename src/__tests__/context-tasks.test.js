/**
 *
 */
import TaskList from 'listr';
import exec from 'execa';
import getTasks from '../context-tasks';


/**
 *
 */
const runTasks = options => new TaskList(getTasks(options), { renderer: 'silent' }).run();


/**
 *
 */
describe('TaskRunner', () => {
  afterEach(() => jest.clearAllMocks());

  it('needs a release version', async () => {
    try {
      await runTasks();
    }
    catch (error) {
      expect(error.message).toMatch(/Version should be/);
    }
  });

  it('needs a valid release version', async () => {
    try {
      await runTasks({ pkg: { version: '1.0.0' }, releaseVersion: '0.0.5' });
    }
    catch (error) {
      expect(error.message).toMatch(/New version `0.0.5` should be higher/);
    }
  });

  it('needs a tag with a prerelease version', async () => {
    try {
      await runTasks({ pkg: { version: '1.0.0' }, releaseVersion: '2.0.0-beta1' });
    }
    catch (error) {
      expect(error.message).toMatch(/You must specify a dist-tag/);
    }
  });

  it('checks git tag existence', async () => {
    exec.__setMockResults([
      '', // git fetch
      'cf23df2207d99a74fbe169e3eba035e633b65d94', // git rev-parse
    ]);

    try {
      await runTasks({ pkg: { version: '1.0.0' }, releaseVersion: '2.0.0' });
    }
    catch (error) {
      expect(error.message).toBe('Git tag `v2.0.0` already exists.');
    }
  });

  it('checks current branch', async () => {
    try {
      await runTasks({ pkg: { version: '1.0.0' }, releaseVersion: '2.0.0' });
    }
    catch (error) {
      expect(error.message).toMatch(/Not on `master` branch. Use --any-branch to publish anyway./);
    }
  });

  it('checks local working tree', async () => {
    exec.__setMockResults([
      '', // git fetch
      '', // git rev-parse
      'master', // git symbolic-ref
      'unclean', // git status
    ]);

    try {
      await runTasks({ pkg: { version: '1.0.0' }, releaseVersion: '2.0.0' });
    }
    catch (error) {
      expect(error.message).toMatch(/Unclean working tree. Commit or stash changes first./);
    }
  });

  it('checks remote history', async () => {
    exec.__setMockResults([
      '', // git fetch
      '', // git rev-parse
      'master', // git symbolic-ref
      '', // git status
      '1', // git rev-list
    ]);

    try {
      await runTasks({ pkg: { version: '1.0.0' }, releaseVersion: '2.0.0' });
    }
    catch (error) {
      expect(error.message).toMatch(/Remote history differs. Please pull changes./);
    }
  });

  it('runs all tasks', async () => {
    exec.__setMockResults([
      '', // git fetch
      '', // git rev-parse
      'master', // git symbolic-ref
      '', // git status
      '0', // git rev-list
    ]);

    try {
      await runTasks({ pkg: { version: '1.0.0' }, releaseVersion: '2.0.0-beta1', options: { tag: 'beta' } });
    }
    catch (error) {
      expect(error).not.toBeDefined();
    }
  });
});
