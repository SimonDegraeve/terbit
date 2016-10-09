/**
 *
 */

const del = jest.genMockFromModule('del');

del.mockImplementation(() => Promise.resolve());

export default del;
