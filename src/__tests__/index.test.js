/**
 *
 */
import TaskList from 'listr';
import getTaskRunner from '../';


/**
 *
 */
describe('TaskRunner', () => {
  it('runs a tasks list', async () => {
    const taskRunner = await getTaskRunner(undefined, undefined, 'silent');
    taskRunner._tasks.forEach(task =>
      expect(task.task()).toBeInstanceOf(TaskList),
    );
    expect(taskRunner).toBeInstanceOf(TaskList);
  });

  it('throws on invalid changelog preset', async () => {
    try {
      await getTaskRunner(undefined, { changelogPreset: 'unknown' }, 'silent');
    }
    catch (error) {
      expect(error.message).toBe('Invalid changelog preset.');
    }
  });

  it('uses changelog preset', async () => {
    const taskRunner = await getTaskRunner(undefined, { changelogPreset: 'angular' }, 'silent');
    expect(taskRunner._options.props.changelogPresetConfig).toBeDefined();
  });

  it('works with release type', async () => {
    const taskRunner = await getTaskRunner('major', undefined, 'silent');
    expect(taskRunner._options.props.releaseVersion).toBe('2.0.0');
  });

  it('works with version', async () => {
    const taskRunner = await getTaskRunner('3.0.0', undefined, 'silent');
    expect(taskRunner._options.props.releaseVersion).toBe('3.0.0');
  });
});
