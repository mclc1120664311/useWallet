import { renderHook, act } from '@testing-library/react-hooks';
import { useWallet } from '../index';

describe('useWallet tests', () => {
  it('should be defined', () => {
    expect(useWallet).toBeDefined();
  });

  it('renders the hook correctly and checks types', () => {
    const { result } = renderHook(() => useWallet(['0x61']));
    expect(result.current.count).toBe(0);
    expect(typeof result.current.count).toBe('number');
    expect(typeof result.current.increment).toBe('function');
  });
});
