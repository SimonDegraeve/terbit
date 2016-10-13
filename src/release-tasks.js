/**
 *
 */
import path from 'path';
import exec from 'execa';
import writePkg from 'write-pkg';
import readPkgUp from 'read-pkg-up';
import { execObservable } from './utils';


/**
 *
 */
export default function getReleaseTasks(props = {}) {
  const { pkg = {}, options = {}, releaseVersion, pkgPath, changelogPresetConfig } = props;
  const skipBuild = !pkg.scripts || !pkg.scripts.build;
  let commitMessage = releaseVersion;
  if (changelogPresetConfig && changelogPresetConfig.releaseCommitMessage) {
    commitMessage = changelogPresetConfig.releaseCommitMessage.replace('%s', releaseVersion);
  }

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
        const { pkg: originalPkg } = await readPkgUp({ normalize: false });
        await writePkg(pkgPath, { ...originalPkg, version: releaseVersion });
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
        await exec('git', ['commit', '--message', commitMessage]);
        await exec('git', ['tag', '--annotate', '--message', commitMessage, `v${releaseVersion}`]);
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
