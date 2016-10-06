/**
 *
 */
import TaskList from 'listr';
import mockExec from 'execa';
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
      expect(error.message).toBe('Version should be either major, minor, patch, premajor, preminor, prepatch, prerelease, or a valid semver version.');
    }
  });

  it('needs a valid release version', async () => {
    try {
      await runTasks({ pkg: { version: '1.0.0' }, releaseVersion: '0.0.5' });
    }
    catch (error) {
      expect(error.message).toBe('New version `0.0.5` should be higher than current version `1.0.0`.');
    }
  });

  it('needs a tag with a prerelease version', async () => {
    try {
      await runTasks({ pkg: { version: '1.0.0' }, releaseVersion: '2.0.0-beta1' });
    }
    catch (error) {
      expect(error.message).toBe('You must specify a dist-tag using --tag when publishing a pre-release version. This prevents accidentally tagging unstable versions as "latest". https://docs.npmjs.com/cli/dist-tag');
    }
  });

  it('checks git tag existence', async () => {
    mockExec.__setMockOutput([
      [], // git fetch
      ['1234567'], // git rev-parse
      [], // git symbolic-ref
      [], // git status
      [], // git rev-list
    ]);

    try {
      await runTasks({ pkg: { version: '1.0.0' }, releaseVersion: '2.0.0' });
    }
    catch (error) {
      expect(error.message).toBe('Git tag `v2.0.0` already exists.');
    }
  });

  it('checks current branch', async () => {
    mockExec.__setMockOutput([
      [], // git fetch
      [], // git rev-parse
      [], // git symbolic-ref
      [], // git status
      [], // git rev-list
    ]);

    try {
      await runTasks({ pkg: { version: '1.0.0' }, releaseVersion: '2.0.0' });
    }
    catch (error) {
      expect(error.message).toBe('Not on `master` branch. Use --any-branch to publish anyway.');
    }
  });

  it('checks local working tree', async () => {
    mockExec.__setMockOutput([
      [], // git fetch
      [], // git rev-parse
      ['master'], // git symbolic-ref
      ['unclean'], // git status
      [], // git rev-list
    ]);

    try {
      await runTasks({ pkg: { version: '1.0.0' }, releaseVersion: '2.0.0' });
    }
    catch (error) {
      expect(error.message).toBe('Unclean working tree. Commit or stash changes first.');
    }
  });

  it('checks remote history', async () => {
    mockExec.__setMockOutput([
      [], // git fetch
      [], // git rev-parse
      ['master'], // git symbolic-ref
      [], // git status
      ['1'], // git rev-list
    ]);

    try {
      await runTasks({ pkg: { version: '1.0.0' }, releaseVersion: '2.0.0' });
    }
    catch (error) {
      expect(error.message).toBe('Remote history differs. Please pull changes.');
    }
  });

  it('runs all tasks', async () => {
    mockExec.__setMockOutput([
      [], // git fetch
      [], // git rev-parse
      ['master'], // git symbolic-ref
      [], // git status
      ['0'], // git rev-list
    ]);

    try {
      await runTasks({ pkg: { version: '1.0.0' }, releaseVersion: '2.0.0-beta1', options: { tag: 'beta' } });
    }
    catch (error) {
      expect(error).not.toBeDefined();
    }
  });
});
