import { useMutation } from '@tanstack/react-query';
import { agentService } from '../services/agent.service';

export const useCheckAgencyCode = () => {
  return useMutation({
    mutationFn: (agentCode: string) => agentService.checkAgencyCode(agentCode),
    onError: (error: any) => {
      console.error('Agency code check failed:', error);
    },
  });
};
