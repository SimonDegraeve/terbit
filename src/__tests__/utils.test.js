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
    const result = execObservable();
    expect(result).toBeInstanceOf(Observable);
  });
});
