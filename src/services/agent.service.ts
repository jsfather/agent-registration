import { apiClient, baseApiClient, INSURANCE_CODE } from '../lib/axios';
import type { SignupRequest, SignupResponse } from '../types/form.types';

export interface CheckAgencyCodeRequest {
  agent_code: string;
}

export interface CheckAgencyCodeResponse {
  success: boolean;
  message?: string;
  error_details?: {
    fa_details?: string;
  };
}

export interface Province {
  id: number;
  name: string;
}

export interface County {
  id: number;
  name: string;
  province: number;
}

export interface InsuranceBranch {
  id: number;
  name: string;
  province: number;
  county: number;
  insurance: number;
}

export const agentService = {
  checkAgencyCode: async (agentCode: string): Promise<CheckAgencyCodeResponse> => {
    const response = await apiClient.post<CheckAgencyCodeResponse>(
      '/agent/verification/signup/check_agency_code/',
      { agent_code: agentCode }
    );
    return response.data;
  },

  getProvinces: async (): Promise<Province[]> => {
    const response = await baseApiClient.get<Province[]>(
      '/base/provinces_wop/'
    );
    return response.data;
  },

  getCounties: async (provinceId: number): Promise<County[]> => {
    const response = await baseApiClient.get<County[]>(
      '/base/counties_wop/',
      { params: { province: provinceId } }
    );
    return response.data;
  },

  getInsuranceBranches: async (provinceId: number, searchName?: string): Promise<InsuranceBranch[]> => {
    const response = await baseApiClient.get<InsuranceBranch[]>(
      '/api/v2/app/selection_item/insurance_branch/wop_list/',
      { 
        params: { 
          insurance: INSURANCE_CODE,
          province: provinceId,
          ...(searchName && { name: searchName })
        } 
      }
    );
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await apiClient.post<SignupResponse>(
      '/agent/verification/signup/',
      data
    );
    return response.data;
  },
};
