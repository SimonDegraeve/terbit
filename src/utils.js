/**
 *
 */
import 'any-observable/register/rxjs-all';
import Observable from 'any-observable';
import streamToObservable from 'stream-to-observable';
import exec from 'execa';
import split from 'split';


/**
 *
 */
export function execObservable(cmd, args) {
  // Use `Observable` support if merged https://github.com/sindresorhus/execa/pull/26
  const childProcess = exec(cmd, args);

  return Observable.merge(
    streamToObservable(childProcess.stdout.pipe(split()), { await: childProcess }),
    streamToObservable(childProcess.stderr.pipe(split()), { await: childProcess })
  ).filter(Boolean);
}
