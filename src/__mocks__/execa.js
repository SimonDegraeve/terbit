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
    exitCode === 0 ? Promise.resolve({ stdout, stderr }) : Promise.reject(),
    { stdout: stdoutStream, stderr: stderrStream }
  );
});


/**
 *
 */
execa.stdout = () => {
  // if (!outputCache.length) throw createMissingMockOutputError();
  const [stdout = '', /**/, exitCode = 0] = outputCache.shift() || [];
  return exitCode === 0 ? Promise.resolve(stdout) : Promise.reject();
};


/**
 *
 */
execa.stderr = () => {
  // if (!outputCache.length) throw createMissingMockOutputError();
  const [/**/, stderr = '', exitCode = 0] = outputCache.shift() || [];
  return exitCode === 0 ? Promise.resolve(stderr) : Promise.reject();
};


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
