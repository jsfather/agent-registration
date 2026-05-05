import { useQuery } from '@tanstack/react-query';
import { agentService } from '../services/agent.service';

export const useProvinces = () => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: () => agentService.getProvinces(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
