
export interface Application {
  id: number;
  application_date: string;
  mouza_name: string;
  applicant_name: string;
  user_id: string;
  mobile_number: string;
  application_number: string;
  case_number: string;
  application_status: string;
  application_copy_url: string;
  attached_file_url: string;
  submitter: string;
  status_link: string;
  hearing_date: string | null;
}

export enum ApplicationStatus {
    INITIAL_APPLICATION = 'প্রাথমিক আবেদন',
    SENT_TO_ULO = 'ইউএলও অফিসে প্রেরণ',
    REJECTED_BY_ULO = 'ইউএলও কৃর্তক নামঞ্জুর',
    DRAFT_KHATIAN = 'খসড়া খতিয়ান প্রস্তুত',
    HEARING_SCHEDULED = 'শুনানির দিন ধার্য',
    HEARING_COMPLETED = 'শুনানি সম্পন্ন',
    COMPLETED = 'নামজারি সম্পন্ন',
    REJECTED = 'আবেদন নামঞ্জুর',
}
