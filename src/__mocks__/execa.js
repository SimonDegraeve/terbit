/**
 *
 */
import { Readable } from 'stream';

class Source extends Readable {
  constructor(content, options) {
    super(options);
    this.content = content;
  }
  _read(size) {
    if (!this.content) {
      this.push(null);
    }
    else {
      this.push(this.content.slice(0, size));
      this.content = this.content.slice(size);
    }
  }
}


/**
 *
 */
let outputCache = [];


/**
 *
 */
const execa = jest.fn(() => {
  const [stdout = '', stderr = '', exitCode = 0] = outputCache.shift() || [];
  const stdoutStream = new Source(stdout);
  const stderrStream = new Source(stderr);

  return Object.assign(
    exitCode === 0 ? Promise.resolve({ stdout, stderr }) : Promise.reject({ stdout, stderr }),
    { stdout: stdoutStream, stderr: stderrStream }
  );
});


/**
 *
 */
execa.stdout = jest.fn(() => {
  const [stdout = '', stderr = '', exitCode = 0] = outputCache.shift() || [];
  return exitCode === 0 ? Promise.resolve(stdout) : Promise.reject({ stdout, stderr });
});


/**
 *
 */
execa.stderr = jest.fn(() => {
  const [stdout = '', stderr = '', exitCode = 0] = outputCache.shift() || [];
  return exitCode === 0 ? Promise.resolve(stderr) : Promise.reject({ stdout, stderr });
});


/**
 *
 */
execa.__setMockOutput = (outputs = []) => {
  outputCache = outputs;
};


/**
 *
 */
export default execa;
