/**
 *
 */
const pkgData = {
  pkgPath: 'package.json',
  pkg: {
    version: '1.0.0',
  },
};


/**
 *
 */
export default Object.assign(
  jest.fn(() => Promise.resolve(pkgData)),
  {
    sync: jest.fn(() => pkgData),
  }
);
