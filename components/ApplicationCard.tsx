import React from 'react';
import { Application, ApplicationStatus } from '../types';
import { ExternalLinkIcon, EditIcon, DeleteIcon } from './Icons';

interface ApplicationCardProps {
  app: Application;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  isReadOnly?: boolean;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ app, onEdit, onDelete, isReadOnly = false }) => {
    const getStatusBadge = (status: string) => {
        const baseClasses = "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap";
        switch (status) {
            case ApplicationStatus.INITIAL_APPLICATION: return `${baseClasses} bg-blue-100 text-blue-800 border-blue-200`;
            case ApplicationStatus.SENT_TO_ULO: return `${baseClasses} bg-cyan-100 text-cyan-800 border-cyan-200`;
            case ApplicationStatus.REJECTED_BY_ULO: return `${baseClasses} bg-red-100 text-red-800 border-red-200`;
            case ApplicationStatus.DRAFT_KHATIAN: return `${baseClasses} bg-yellow-100 text-yellow-800 border-yellow-200`;
            case ApplicationStatus.HEARING_SCHEDULED: return `${baseClasses} bg-orange-100 text-orange-800 border-orange-200`;
            case ApplicationStatus.HEARING_COMPLETED: return `${baseClasses} bg-purple-100 text-purple-800 border-purple-200`;
            case ApplicationStatus.COMPLETED: return `${baseClasses} bg-green-100 text-green-800 border-green-200`;
            case ApplicationStatus.REJECTED: return `${baseClasses} bg-red-100 text-red-800 border-red-200`;
            default: return `${baseClasses} bg-gray-100 text-gray-800 border-gray-200`;
        }
    };
    
    const isUpcoming = (dateStr: string | null): boolean => {
        if (!dateStr) return false;
        try {
            const [day, month, year] = dateStr.split('/').map(Number);
            const hearingDate = new Date(year, month - 1, day);
            const today = new Date();
            const nextWeek = new Date();
            nextWeek.setDate(today.getDate() + 7);
            today.setHours(0,0,0,0);
            return hearingDate >= today && hearingDate <= nextWeek;
        } catch (e) {
            return false;
        }
    };

  return (
    <div className={`rounded-lg border bg-white p-4 shadow-sm mb-3 ${isUpcoming(app.hearing_date) ? 'border-orange-300 bg-orange-50' : 'border-slate-200'}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-bold text-slate-900">{app.applicant_name}</p>
          <p className="text-sm text-slate-600">{app.mouza_name}</p>
        </div>
        <div className={getStatusBadge(app.application_status)}>{app.application_status}</div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
        <div>
          <p className="text-slate-600">আবেদন নম্বর</p>
          <p className="font-medium text-slate-800">{app.application_number}</p>
        </div>
        <div>
          <p className="text-slate-600">কেস নং</p>
          <p className="font-medium text-slate-800">{app.case_number}</p>
        </div>
        <div>
          <p className="text-slate-600">মোবাইল</p>
          <p className="font-medium text-slate-800">{app.mobile_number}</p>
        </div>
        <div>
          <p className="text-slate-600">তারিখ</p>
          <p className="font-medium text-slate-800">{app.application_date}</p>
        </div>
      </div>

      {app.hearing_date && (
        <div className={`text-sm p-2 rounded-md mb-3 ${isUpcoming(app.hearing_date) ? 'bg-orange-100 font-bold text-orange-700' : 'bg-slate-100 text-slate-700'}`}>
          শুনানির তারিখ: {app.hearing_date}
        </div>
      )}

      <div className="border-t pt-3 flex justify-between items-center">
         <div className="flex gap-3">
            <a href={app.application_copy_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800" title="আবেদন কপি"><ExternalLinkIcon/></a>
            <a href={app.attached_file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800" title="সংযুক্ত ফাইল"><ExternalLinkIcon/></a>
         </div>
        {!isReadOnly && (
          <div className="flex items-center gap-1">
            <a href={app.status_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium hover:bg-gray-100" title="অবস্থা দেখুন">
              <ExternalLinkIcon/>
            </a>
            <button onClick={() => onEdit(app)} className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 hover:bg-gray-100" title="সম্পাদনা">
              <EditIcon/>
            </button>
            <button onClick={() => onDelete(app.id)} className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 hover:bg-gray-100" title="মুছে ফেলুন">
              <DeleteIcon/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;