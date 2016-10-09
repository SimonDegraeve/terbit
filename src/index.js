/**
 *
 */
import TaskList from 'listr';
import readPkgUp from 'read-pkg-up';
import semver from 'semver';
import getRecommendedBump from 'conventional-recommended-bump';
import toPromise from 'pify';
import { silent as requireSafely } from 'req-cwd';
import { RELEASE_TYPES } from './constants';
import getContextTasks from './context-tasks';
import getCodeTasks from './code-tasks';
import getReleaseTasks from './release-tasks';


/**
 *
 */
function getChangelogPresetConfig(presetName) {
  const changelogPresetConfig = (
    requireSafely(`conventional-changelog-${presetName}`) || requireSafely(presetName)
  );

  if (!changelogPresetConfig) {
    throw new Error('Invalid changelog preset.');
  }

  return Promise.resolve(changelogPresetConfig);
}


/**
 *
 */
async function getReleaseVersion(input, currentVersion, changelogPresetConfig) {
  let releaseType = input || 'patch';

  if (changelogPresetConfig && !input) {
    releaseType = (
      await toPromise(getRecommendedBump)({ config: changelogPresetConfig })
    ).releaseType;
  }

  if (RELEASE_TYPES.indexOf(releaseType) === -1) {
    return releaseType;
  }

  return semver.inc(currentVersion, releaseType);
}


/**
 *
 */
async function getProps(input, options) {
  const { pkg, path: pkgPath } = await readPkgUp({ normalize: false });

  let changelogPresetConfig;
  if (options.changelogPreset) {
    changelogPresetConfig = await getChangelogPresetConfig(options.changelogPreset);
  }

  const releaseVersion = await getReleaseVersion(input, pkg.version, changelogPresetConfig);

  return { options, changelogPresetConfig, releaseVersion, pkg, pkgPath };
}


/**
 *
 */
export default async function getTaskRunner(input, options = {}, renderer) {
  const props = await getProps(input, options);
  const tasks = [
    {
      title: 'Checking context',
      task: () => new TaskList(getContextTasks(props)),
    },
    {
      title: 'Checking code',
      task: () => new TaskList(getCodeTasks(props)),
    },
    {
      title: 'Releasing',
      task: () => new TaskList(getReleaseTasks(props)),
    },
  ];

  return new TaskList(tasks, { showSubtasks: true, collapse: false, renderer, props });
}
