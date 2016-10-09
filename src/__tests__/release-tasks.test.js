/**
 *
 */
import TaskList from 'listr';
import exec from 'execa';
import getTasks from '../release-tasks';


/**
 *
 */
const runTasks = options => new TaskList(getTasks(options), { renderer: 'silent' }).run();


/**
 *
 */
describe('TaskRunner', () => {
  afterEach(() => jest.clearAllMocks());

  it('builds code', async () => {
    await runTasks({ pkg: { scripts: { build: 'echo "building"' } } });
    expect(exec).toHaveBeenCalledTimes(6);
  });

  it('skips writing changelog', async () => {
    await runTasks();
    expect(exec).toHaveBeenCalledTimes(5);
  });

  it('writes changelog', async () => {
    await runTasks({ changelogPresetConfig: {}, pkgPath: 'package.json' });
    expect(exec).toHaveBeenCalledTimes(7);
  });

  it('commits with a custom message', async () => {
    await runTasks({
      releaseVersion: '1.0.0',
      changelogPresetConfig: { releaseCommitMessage: 'custom %s' },
      pkgPath: 'package.json',
    });
    expect(exec.mock.calls[3][1]).toContain('custom 1.0.0');
    expect(exec).toHaveBeenCalledTimes(7);
  });

  it('skips publishing', async () => {
    await runTasks({ pkg: { private: true } });
    expect(exec).toHaveBeenCalledTimes(4);
  });

  it('publish with tag', async () => {
    await runTasks({ options: { tag: 'beta' } });
    expect(exec).toHaveBeenCalledTimes(5);
    expect(exec.mock.calls[3][1]).toContain('beta');
  });
});
