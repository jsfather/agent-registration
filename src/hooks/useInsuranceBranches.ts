import { useQuery } from '@tanstack/react-query';
import { agentService } from '../services/agent.service';

export const useInsuranceBranches = (provinceId: number | null, searchName?: string) => {
  return useQuery({
    queryKey: ['insuranceBranches', provinceId, searchName],
    queryFn: () => agentService.getInsuranceBranches(provinceId!, searchName),
    enabled: !!provinceId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
