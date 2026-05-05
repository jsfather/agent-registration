export interface RegistrationFormData {
  agentCode: string;
  province: string;
  city: string;
  address: string;
  insuranceType: string;
  phoneNumber: string;
  representativeType: 'legal' | 'real';
  firstName: string;
  lastName: string;
  mobileNumber: string;
  agencyName?: string;
}

export interface SignupRequest {
  agent_code: string;
  province: string;
  county: string;
  address: string;
  insurance_branch: string;
  phone: string;
  city_code: string;
  agency_type: 'legal' | 'real';
  first_name: string;
  last_name: string;
  phone_number: string;
  name?: string;
}

export interface SignupResponse {
  status_code: number;
  message: string;
  is_success: boolean;
  error_details: any;
  response: {
    access: string;
    refresh: string;
  };
}
