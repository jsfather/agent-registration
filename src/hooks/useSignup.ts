import { useMutation } from '@tanstack/react-query';
import { agentService } from '../services/agent.service';
import type { SignupRequest } from '../types/form.types';

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignupRequest) => agentService.signup(data),
  });
};
