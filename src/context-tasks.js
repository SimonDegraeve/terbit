/**
 *
 */
import url from 'url';
import exec from 'execa';
import semver from 'semver';
import { RELEASE_TYPES } from './constants';


/**
 *
 */
export default function getContextTasks(props = {}) {
  const { pkg = {}, options = {}, releaseVersion } = props;

  return [
    {
      title: 'Validating version',
      task: () => {
        if (!semver.valid(releaseVersion)) {
          throw new Error(`Version should be either ${RELEASE_TYPES.join(', ')}, or a valid semver version.`);
        }

        if (semver.gte(pkg.version, releaseVersion)) {
          throw new Error(`New version \`${releaseVersion}\` should be higher than current version \`${pkg.version}\`.`);
        }

        if (semver.prerelease(releaseVersion) && !options.tag) {
          throw new Error('You must specify a dist-tag using --tag when publishing a pre-release version. This prevents accidentally tagging unstable versions as "latest". https://docs.npmjs.com/cli/dist-tag');
        }
      },
    },
    {
      title: 'Checking git repository',
      task: async () => {
        try {
          await exec('git', ['rev-parse', 'HEAD']);
        }
        catch (error) {
          if (error.message.match(/Not a git repository/)) {
            throw new Error('Not a git repository. Run `git init`.');
          }
          if (error.message.match(/ambiguous argument/)) {
            throw new Error('Empty repository. Commit changes first.');
          }
          throw error;
        }
      },
    },
    {
      title: 'Checking git tag existence',
      task: async () => {
        try {
          await exec('git', ['fetch']);
        }
        catch (error) {
          if (error.message.match(/No remote repository specified/)) {
            let upstreamUrl = (pkg.repository && pkg.repository.url) || false;

            if (upstreamUrl) {
              upstreamUrl = url.format({ ...url.parse(upstreamUrl), protocol: 'https' });
              throw new Error(`No remote repository configured. Run \`git remote add origin ${upstreamUrl}; git push -u origin master\``);
            }

            throw new Error('No remote repository configured.');
          }

          throw error;
        }

        let hasTag = false;
        try {
          hasTag = !!(await exec.stdout('git', ['rev-parse', '--quiet', '--verify', `refs/tags/v${releaseVersion}`]));
        }
        catch (error) {
          // Do nothing
        }

        if (hasTag) {
          throw new Error(`Git tag \`v${releaseVersion}\` already exists.`);
        }
      },
    },
    {
      title: 'Checking current branch',
      skip: () => options.anyBranch,
      task: async () => {
        const branch = await exec.stdout('git', ['symbolic-ref', '--short', 'HEAD']);

        if (branch !== 'master') {
          throw new Error('Not on `master` branch. Use --any-branch to publish anyway.');
        }
      },
    },
    {
      title: 'Checking local working tree',
      task: async () => {
        const status = await exec.stdout('git', ['status', '--porcelain']);

        if (status !== '') {
          throw new Error('Unclean working tree. Commit or stash changes first.');
        }
      },
    },
    {
      title: 'Checking remote history',
      task: async () => {
        const result = await exec.stdout('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD']);

        if (result !== '0') {
          throw new Error('Remote history differs. Please pull changes.');
        }
      },
    },
  ];
}
