import { renderHook } from '@testing-library/react-hooks';
import { useWallet } from '../index';

describe('useWallet tests', () => {
  it('should be defined', () => {
    expect(useWallet).toBeDefined();
  });

  it('renders the hook correctly and checks types', () => {
    const { result } = renderHook(() => useWallet({ supportedChainIds: [97] }));
    expect(result.current.address).toBe('string');
    expect(result.current.address).toBe(0);
    expect(typeof result.current.address).toBe('number');
    expect(typeof result.current.address).toBe('function');
  });
});
