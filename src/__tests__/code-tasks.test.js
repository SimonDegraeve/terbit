/**
 *
 */
import TaskList from 'listr';
import exec from 'execa';
import del from 'del';
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
    expect(del).toHaveBeenCalledTimes(1);
    expect(exec).toHaveBeenCalledTimes(2);
  });

  it('skips cleaning up', async () => {
    await runTasks({ options: { skipCleanup: true } });
    expect(del).toHaveBeenCalledTimes(0);
    expect(exec).toHaveBeenCalledTimes(1);
  });

  it('skips testing', async () => {
    await runTasks({ options: { skipTest: true } });
    expect(del).toHaveBeenCalledTimes(0);
    expect(exec).toHaveBeenCalledTimes(0);
  });

  it('runs linting', async () => {
    await runTasks({ pkg: { scripts: { lint: 'echo "linting"' } } });
    expect(del).toHaveBeenCalledTimes(1);
    expect(exec).toHaveBeenCalledTimes(3);
  });
});
