/**
 *
 */
import path from 'path';
import exec from 'execa';
import writePkg from 'write-pkg';
import { execObservable } from './utils';


/**
 *
 */
export default function getReleaseTasks(props = {}) {
  const { pkg = {}, options = {}, releaseVersion, pkgPath, changelogPresetConfig } = props;
  const skipBuild = !pkg.scripts || !pkg.scripts.build;

  return [
    {
      title: 'Building code',
      skip: () => skipBuild,
      task: async () => {
        await exec('npm', ['run', 'build']);
      },
    },
    {
      title: 'Bumping version',
      task: async () => {
        await writePkg(pkgPath, { ...pkg, version: releaseVersion });
        await exec('git', ['add', pkgPath]);
      },
    },
    {
      title: 'Generating changelog',
      skip: () => !changelogPresetConfig,
      task: async () => {
        const changelogPath = path.join(path.dirname(pkgPath), 'CHANGELOG.md');
        await exec('conventional-changelog', [
          '--infile', changelogPath, '--same-file', '--preset', options.changelogPreset, '--release-count', 0,
        ]);
        await exec('git', ['add', changelogPath]);
      },
    },
    {
      title: 'Committing release',
      task: async () => {
        let message = releaseVersion;
        if (changelogPresetConfig && changelogPresetConfig.releaseCommitMessage) {
          message = changelogPresetConfig.releaseCommitMessage.replace('%s', releaseVersion);
        }
        await exec('git', ['commit', '--message', message]);
        await exec('git', ['tag', `v${releaseVersion}`]);
      },
    },
    {
      title: 'Publishing package',
      skip: () => (pkg.private ? 'Private package: not publishing to npm.' : false),
      task: () => execObservable('npm', ['publish'].concat(options.tag ? ['--tag', options.tag] : [])),
    },
    {
      title: 'Pushing tags',
      task: () => execObservable('git', ['push', '--follow-tags']),
    },
  ];
}
