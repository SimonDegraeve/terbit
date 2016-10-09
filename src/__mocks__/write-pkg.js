/**
 *
 */
const writePkg = jest.genMockFromModule('write-pkg');

writePkg.mockImplementation(() => Promise.resolve());

export default writePkg;
