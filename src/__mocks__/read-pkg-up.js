/**
 *
 */
const readPkgUp = jest.genMockFromModule('read-pkg-up');

readPkgUp.mockImplementation(() => Promise.resolve({
  path: 'package.json',
  pkg: {
    version: '1.0.0',
  },
}));

export default readPkgUp;
