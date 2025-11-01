
import React, { useState, useEffect } from 'react';
import { Application, ApplicationStatus } from '../types';

interface ApplicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (application: Omit<Application, 'id' | 'user_id'> | Application) => void;
  applicationToEdit: Application | null;
}

// Converts DD/MM/YYYY to YYYY-MM-DD for date inputs
const dmyToYmd = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  const parts = dateString.split('/');
  if (parts.length !== 3) return dateString; 
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Converts YYYY-MM-DD from date inputs to DD/MM/YYYY for storage
const ymdToDmy = (dateString: string | null | undefined): string | null => {
    if (!dateString) return null;
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
};


const ApplicationDialog: React.FC<ApplicationDialogProps> = ({ isOpen, onClose, onSubmit, applicationToEdit }) => {
  const initialState = {
    application_date: new Date().toISOString().split('T')[0],
    applicant_name: '',
    mouza_name: '',
    mobile_number: '',
    manual_user_id: '',
    application_number: '',
    case_number: '',
    application_status: ApplicationStatus.INITIAL_APPLICATION,
    application_copy_url: '',
    attached_file_url: '',
    submitter: '',
    status_link: '',
    hearing_date: null,
  };

  const [formState, setFormState] = useState<any>(initialState);

  const submitters = ['জিল্লুর রহমান', 'ফিরোক কবির', 'বাধন', 'তানভির'];

  useEffect(() => {
    if (applicationToEdit) {
      setFormState({
        ...applicationToEdit,
        application_date: dmyToYmd(applicationToEdit.application_date),
        hearing_date: dmyToYmd(applicationToEdit.hearing_date),
      });
    } else {
      setFormState(initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => {
        const newState = { ...prevState, [name]: value };
        // If status changes and it's not "Hearing Scheduled", clear hearing date
        if (name === 'application_status' && value !== ApplicationStatus.HEARING_SCHEDULED) {
            newState.hearing_date = null;
        }
        return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
        ...formState,
        application_date: ymdToDmy(formState.application_date) || new Date().toLocaleDateString('bn-BD', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        // Fix: Corrected typo from `ymdToYmd` to `ymdToDmy`
        hearing_date: ymdToDmy(formState.hearing_date),
    };
    onSubmit(submissionData);
    onClose();
  };

  const formFields = [
    { name: 'applicant_name', label: 'আবেদনকারীর নাম', type: 'text' },
    { name: 'mouza_name', label: 'মৌজা', type: 'text' },
    { name: 'application_number', label: 'আবেদন নম্বর', type: 'text' },
    { name: 'case_number', label: 'কেস নং', type: 'text' },
    { name: 'application_date', label: 'আবেদনের তারিখ', type: 'date' },
    { name: 'application_copy_url', label: 'আবেদন কপির URL', type: 'url' },
    { name: 'attached_file_url', label: 'সংযুক্ত ফাইলের URL', type: 'url' },
    { name: 'status_link', label: 'অবস্থা দেখার URL', type: 'url' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center no-print">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{applicationToEdit ? 'আবেদন সম্পাদনা করুন' : 'নতুন আবেদন যোগ করুন'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formFields.slice(0, 2).map(field => (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.label}</label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={(formState as any)[field.name] || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
            ))}
             <div>
                <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700">মোবাইল নম্বর</label>
                <input
                  type="tel"
                  id="mobile_number"
                  name="mobile_number"
                  value={formState.mobile_number || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                  pattern="[1-9][0-9]{9}"
                  maxLength={10}
                  title="অনুগ্রহ করে ০ ছাড়া ১০ ডিজিটের মোবাইল নম্বর দিন।"
                />
                 <p className="text-xs text-gray-500 mt-1">উদাহরণ: 1712345678</p>
              </div>
               <div>
                <label htmlFor="manual_user_id" className="block text-sm font-medium text-gray-700">ইউজার আইডি</label>
                <input
                  type="text"
                  id="manual_user_id"
                  name="manual_user_id"
                  value={formState.manual_user_id || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            {formFields.slice(2).map(field => (
                 <div key={field.name}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.label}</label>
                    <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={(formState as any)[field.name] || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required={!['hearing_date', 'application_copy_url', 'attached_file_url', 'status_link'].includes(field.name)}
                    />
                </div>
            ))}
             <div>
                <label htmlFor="application_status" className="block text-sm font-medium text-gray-700">বর্তমান অবস্থা</label>
                <select 
                    id="application_status"
                    name="application_status"
                    value={formState.application_status}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    {Object.values(ApplicationStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>
            {formState.application_status === ApplicationStatus.HEARING_SCHEDULED && (
                <div>
                    <label htmlFor="hearing_date" className="block text-sm font-medium text-gray-700">শুনানির তারিখ</label>
                    <input
                    type="date"
                    id="hearing_date"
                    name="hearing_date"
                    value={formState.hearing_date || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                    />
                </div>
            )}
             <div className="md:col-span-2">
                <label htmlFor="submitter" className="block text-sm font-medium text-gray-700">দাখিলকারী</label>
                <input
                  type="text"
                  id="submitter"
                  name="submitter"
                  list="submitters-list"
                  value={formState.submitter || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
                <datalist id="submitters-list">
                    {submitters.map(s => <option key={s} value={s} />)}
                </datalist>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">বাতিল</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{applicationToEdit ? 'আপডেট করুন' : 'দাখিল করুন'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationDialog;
