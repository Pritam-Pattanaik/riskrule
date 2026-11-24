import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import type { Strategy } from '../types';

export function useTradeStrategies(enabled: boolean) {
  const userId = useAuthStore(state => state.user?.id);
  return useQuery({
    queryKey: ['trade-strategies', userId],
    queryFn: () => api.get<Strategy[]>('/strategies'),
    enabled: !!userId && enabled,
    staleTime: 0,
  });
}
