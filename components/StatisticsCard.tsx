import React from 'react';
import { ApplicationStatus } from '../types';

interface StatisticsProps {
    stats: {
        total: number;
        [key: string]: number;
    };
}

const statusConfig: { [key in ApplicationStatus]?: { label: string; icon: string; color: string; bgColor: string; } } = {
    [ApplicationStatus.COMPLETED]: { label: 'নামজারি সম্পন্ন', icon: 'fa-check-circle', color: 'text-green-600', bgColor: 'bg-green-100' },
    [ApplicationStatus.HEARING_SCHEDULED]: { label: 'শুনানির দিন ধার্য', icon: 'fa-calendar-check', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    [ApplicationStatus.DRAFT_KHATIAN]: { label: 'খসড়া খতিয়ান প্রস্তুত', icon: 'fa-file-signature', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    [ApplicationStatus.REJECTED]: { label: 'আবেদন নামঞ্জুর', icon: 'fa-times-circle', color: 'text-red-600', bgColor: 'bg-red-100' },
    [ApplicationStatus.SENT_TO_ULO]: { label: 'ইউএলও অফিসে প্রেরণ', icon: 'fa-paper-plane', color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
    [ApplicationStatus.INITIAL_APPLICATION]: { label: 'প্রাথমিক আবেদন', icon: 'fa-file-alt', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    [ApplicationStatus.REJECTED_BY_ULO]: { label: 'ইউএলও কৃর্তক নামঞ্জুর', icon: 'fa-ban', color: 'text-red-700', bgColor: 'bg-red-200' },
    [ApplicationStatus.HEARING_COMPLETED]: { label: 'শুনানি সম্পন্ন', icon: 'fa-gavel', color: 'text-purple-600', bgColor: 'bg-purple-100' },
};


const StatisticsCard: React.FC<StatisticsProps> = ({ stats }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">একনজরে পরিসংখ্যান</h3>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="col-span-2 md:col-span-2 lg:col-span-3 bg-blue-600 text-white rounded-lg shadow-lg p-5 flex items-center justify-between">
                    <div>
                        <p className="text-md font-semibold text-blue-200">মোট আবেদন</p>
                        <p className="text-4xl font-bold">{stats.total}</p>
                    </div>
                    <div className="bg-blue-500 p-4 rounded-full">
                       <i className="fa-solid fa-file-lines text-2xl text-white"></i>
                    </div>
                </div>

                {Object.entries(statusConfig).map(([status, config]) => (
                    config && (
                        <div key={status} className="bg-white rounded-lg p-4 flex items-center gap-3 border border-slate-200/80 hover:shadow-md hover:border-slate-300 transition-all duration-300">
                           <div className={`w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center ${config.bgColor}`}>
                                <i className={`fa-solid ${config.icon} ${config.color} text-xl`}></i>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-2xl font-bold text-slate-800 truncate">{stats[status] || 0}</p>
                                <p className="text-xs font-medium text-slate-500 truncate">{config.label}</p>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default StatisticsCard;