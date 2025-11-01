
import React from 'react';
import { Application, ApplicationStatus } from '../types';
import { SearchIcon, PrintIcon, ExternalLinkIcon, EditIcon, DeleteIcon, DownloadIcon, ChevronsUpDownIcon } from './Icons';
import ApplicationCard from './ApplicationCard';

interface ApplicationTableProps {
    applications: Application[];
    totalApplications: number;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onPrint: () => void;
    onEdit: (app: Application) => void;
    onDelete: (id: string) => void;
    onSort: (key: keyof Application) => void;
    sortConfig: { key: keyof Application; direction: 'ascending' | 'descending' } | null;
    onStatusFilterChange: (status: string) => void;
    onCsvExport: () => void;
    isReadOnly?: boolean;
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({ 
    applications, totalApplications, searchTerm, setSearchTerm, onPrint, onEdit, onDelete, onSort, sortConfig, onStatusFilterChange, onCsvExport, isReadOnly = false
}) => {
    
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
    
    const SortableHeader: React.FC<{ label: string; columnKey: keyof Application, isSortable?: boolean }> = ({ label, columnKey, isSortable = true }) => {
        if (!isSortable) {
            return <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap">{label}</th>;
        }
        const isSorted = sortConfig?.key === columnKey;
        const direction = isSorted ? sortConfig.direction : null;
        return (
            <th onClick={() => onSort(columnKey)} className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap cursor-pointer hover:bg-gray-100">
                <div className="flex items-center gap-2">
                    {label}
                    <span className="opacity-50 hover:opacity-100">
                        {isSorted ? (direction === 'ascending' ? '▲' : '▼') : <ChevronsUpDownIcon />}
                    </span>
                </div>
            </th>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 print-full-width">
            <div className="mb-4 no-print">
                <h2 className="text-lg font-semibold text-slate-900">সকল আবেদন ({totalApplications})</h2>
            </div>
             <div className="hidden print:block mb-4 text-center">
                <h1 className="text-2xl font-bold">আবেদন ব্যবস্থাপনা সিস্টেম</h1>
                <p className="text-sm text-muted-foreground">মুদ্রণ তারিখ: {new Date().toLocaleDateString('bn-BD')}</p>
            </div>
            <div className="flex flex-wrap gap-3 mb-4 no-print">
                <div className="relative flex-grow min-w-[200px]">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></div>
                    <input 
                        className="h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs pl-10 border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="আবেদন নম্বর, নাম, মৌজা, কেস নং, মোবাইল দিয়ে খুঁজুন..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select 
                    onChange={(e) => onStatusFilterChange(e.target.value)}
                    className="h-9 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs border-gray-300 focus:ring-blue-500 focus:border-blue-500 flex-grow sm:flex-grow-0"
                >
                    <option value="all">সকল অবস্থা</option>
                    {Object.values(ApplicationStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <button onClick={onCsvExport} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border shadow-xs h-9 px-4 py-2 gap-2 bg-transparent hover:bg-gray-100">
                    <DownloadIcon />CSV এক্সপোর্ট
                </button>
                <button onClick={onPrint} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border shadow-xs h-9 px-4 py-2 gap-2 bg-transparent hover:bg-gray-100">
                    <PrintIcon />প্রিন্ট করুন
                </button>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden print:hidden">
                 {applications.map(app => (
                    <ApplicationCard 
                        key={app.id}
                        app={app}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        isReadOnly={isReadOnly}
                    />
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="rounded-md border overflow-x-auto print-full-width hidden md:block print:block">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b bg-gray-50">
                        <tr className="border-b transition-colors">
                            <SortableHeader label="ক্রমিক" columnKey="id" isSortable={false} />
                            <SortableHeader label="তারিখ" columnKey="application_date" />
                            <SortableHeader label="আবেদনের তথ্য" columnKey="applicant_name" />
                            <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap">ইউজার আইডি/মোবাইল</th>
                            <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap">আবেদন নম্বর</th>
                            <SortableHeader label="কেস নং" columnKey="case_number" />
                            <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap">বর্তমান অবস্থা</th>
                            <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap">ফাইল</th>
                            <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap">দাখিলকারী</th>
                            {!isReadOnly && <th className="h-10 px-2 align-middle font-medium whitespace-nowrap text-right no-print">অ্যাকশন</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app, index) => (
                            <tr key={app.id} className={`border-b transition-colors hover:bg-gray-50 ${isUpcoming(app.hearing_date) ? 'bg-orange-50' : ''}`}>
                                <td className="p-2 align-middle whitespace-nowrap font-medium">{index + 1}</td>
                                <td className="p-2 align-middle whitespace-nowrap">{app.application_date}</td>
                                <td className="p-2 align-middle whitespace-nowrap">
                                    <div className="space-y-1">
                                        <div className="font-medium text-sm">{app.applicant_name}</div>
                                        <div className="text-xs text-slate-600">{app.mouza_name}</div>
                                    </div>
                                </td>
                                <td className="p-2 align-middle whitespace-nowrap">
                                    <div className="space-y-1">
                                        <div className="text-sm">{`0${app.mobile_number}`}</div>
                                        <div className="text-xs text-slate-600 truncate max-w-[100px]">{app.manual_user_id}</div>
                                    </div>
                                </td>
                                <td className="p-2 align-middle whitespace-nowrap">
                                    <div className="text-sm whitespace-nowrap">{app.application_number}</div>
                                </td>
                                <td className="p-2 align-middle whitespace-nowrap">
                                    <div className="text-sm whitespace-nowrap">{app.case_number}</div>
                                </td>
                                <td className="p-2 align-middle whitespace-nowrap">
                                     <div className="space-y-1">
                                        <span className={getStatusBadge(app.application_status)}>{app.application_status}</span>
                                        {app.hearing_date && <div className={`text-xs mt-1 ${isUpcoming(app.hearing_date) ? 'font-bold text-orange-600' : 'text-slate-600'}`}>শুনানি: {app.hearing_date}</div>}
                                    </div>
                                </td>
                                 <td className="p-2 align-middle whitespace-nowrap">
                                    <div className="flex gap-2">
                                        <a href={app.application_copy_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800" title="আবেদন কপি"><ExternalLinkIcon/></a>
                                        <a href={app.attached_file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800" title="সংযুক্ত ফাইল"><ExternalLinkIcon/></a>
                                    </div>
                                </td>
                                <td className="p-2 align-middle whitespace-nowrap">{app.submitter}</td>
                                {!isReadOnly && (
                                    <td className="p-2 align-middle whitespace-nowrap text-right no-print">
                                        <div className="flex justify-end gap-1">
                                            <a href={app.status_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border shadow-xs h-8 rounded-md gap-1.5 px-3 hover:bg-gray-100">
                                                <ExternalLinkIcon/> অবস্থা দেখুন
                                            </a>
                                            <button onClick={() => onEdit(app)} className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 hover:bg-gray-100" title="সম্পাদনা">
                                                <EditIcon/>
                                            </button>
                                            <button onClick={() => onDelete(app.id)} className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 hover:bg-gray-100" title="মুছে ফেলুন">
                                                <DeleteIcon/>
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {applications.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                    <p>কোনো আবেদন পাওয়া যায়নি।</p>
                </div>
            )}
        </div>
    );
}

export default ApplicationTable;