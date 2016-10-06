/**
 *
 */
import TaskList from 'listr';
import mockExec from 'execa';
import mockRemove from 'del';
import getTasks from '../code-tasks';


/**
 *
 */
const runTasks = options => new TaskList(getTasks(options), { renderer: 'silent' }).run();


/**
 *
 */
describe('TaskRunner', () => {
  afterEach(() => jest.clearAllMocks());

  it('skips linting', async () => {
    await runTasks();
    expect(mockRemove).toHaveBeenCalledTimes(1);
    expect(mockExec).toHaveBeenCalledTimes(2);
  });

  it('skips cleaning up', async () => {
    await runTasks({ options: { skipCleanup: true } });
    expect(mockRemove).toHaveBeenCalledTimes(0);
    expect(mockExec).toHaveBeenCalledTimes(1);
  });

  it('skips testing', async () => {
    await runTasks({ options: { skipTest: true } });
    expect(mockRemove).toHaveBeenCalledTimes(0);
    expect(mockExec).toHaveBeenCalledTimes(0);
  });

  it('runs linting', async () => {
    await runTasks({ pkg: { scripts: { lint: 'echo "linting"' } } });
    expect(mockRemove).toHaveBeenCalledTimes(1);
    expect(mockExec).toHaveBeenCalledTimes(3);
  });
});
