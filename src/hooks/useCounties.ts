import { useQuery } from '@tanstack/react-query';
import { agentService } from '../services/agent.service';

export const useCounties = (provinceId: number | null) => {
  return useQuery({
    queryKey: ['counties', provinceId],
    queryFn: () => agentService.getCounties(provinceId!),
    enabled: !!provinceId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
