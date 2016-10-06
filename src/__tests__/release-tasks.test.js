/**
 *
 */
import TaskList from 'listr';
import mockExec from 'execa';
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
    expect(mockExec).toHaveBeenCalledTimes(6);
  });

  it('skips writing changelog', async () => {
    await runTasks();
    expect(mockExec).toHaveBeenCalledTimes(5);
  });

  it('writes changelog', async () => {
    await runTasks({ changelogPresetConfig: {}, pkgPath: 'package.json' });
    expect(mockExec).toHaveBeenCalledTimes(7);
  });

  it('commits with a custom message', async () => {
    await runTasks({ releaseVersion: '1.0.0', changelogPresetConfig: { releaseCommitMessage: 'custom %s' }, pkgPath: 'package.json' });
    expect(mockExec.mock.calls[3][1][2]).toBe('custom 1.0.0');
    expect(mockExec).toHaveBeenCalledTimes(7);
  });

  it('skips publishing', async () => {
    await runTasks({ pkg: { private: true } });
    expect(mockExec).toHaveBeenCalledTimes(4);
  });

  it('publish with tag', async () => {
    await runTasks({ options: { tag: 'beta' } });
    expect(mockExec).toHaveBeenCalledTimes(5);
    expect(mockExec.mock.calls[3][1][2]).toBe('beta');
  });
});
