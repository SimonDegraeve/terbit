/**
 *
 */
import { Observable } from 'rxjs';
import { execObservable } from '../utils';


/**
 *
 */
describe('execObservable()', () => {
  it('returns an Observable', async () => {
    expect(execObservable()).toBeInstanceOf(Observable);
  });
});
