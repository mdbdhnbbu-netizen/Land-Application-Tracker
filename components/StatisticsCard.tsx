import React from 'react';
import { ApplicationStatus } from '../types';

interface StatisticsProps {
    stats: {
        total: number;
        [key: string]: number;
    };
}

const statusConfig: { [key in ApplicationStatus]?: { label: string; icon: string; color: string; borderColor: string; } } = {
    [ApplicationStatus.COMPLETED]: { label: 'নামজারি সম্পন্ন', icon: 'fa-check-circle', color: 'text-green-500', borderColor: '#22c55e' },
    [ApplicationStatus.HEARING_SCHEDULED]: { label: 'শুনানির দিন ধার্য', icon: 'fa-calendar-check', color: 'text-orange-500', borderColor: '#f97316' },
    [ApplicationStatus.DRAFT_KHATIAN]: { label: 'খসড়া খতিয়ান প্রস্তুত', icon: 'fa-file-signature', color: 'text-yellow-500', borderColor: '#eab308' },
    [ApplicationStatus.REJECTED]: { label: 'আবেদন নামঞ্জুর', icon: 'fa-times-circle', color: 'text-red-500', borderColor: '#ef4444' },
    [ApplicationStatus.SENT_TO_ULO]: { label: 'ইউএলও অফিসে প্রেরণ', icon: 'fa-paper-plane', color: 'text-cyan-500', borderColor: '#06b6d4' },
    [ApplicationStatus.INITIAL_APPLICATION]: { label: 'প্রাথমিক আবেদন', icon: 'fa-file-alt', color: 'text-blue-500', borderColor: '#3b82f6' },
    [ApplicationStatus.REJECTED_BY_ULO]: { label: 'ইউএলও কৃর্তক নামঞ্জুর', icon: 'fa-ban', color: 'text-red-600', borderColor: '#dc2626' },
    [ApplicationStatus.HEARING_COMPLETED]: { label: 'শুনানি সম্পন্ন', icon: 'fa-gavel', color: 'text-purple-500', borderColor: '#a855f7' },
};


const StatisticsCard: React.FC<StatisticsProps> = ({ stats }) => {
    return (
        <div className="mb-6 no-print">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg shadow-lg p-5">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 backdrop-blur-sm text-white w-14 h-14 rounded-xl flex items-center justify-center border border-white/30">
                           <i className="fa-solid fa-file-lines text-2xl"></i>
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-semibold text-white/80">মোট আবেদন</p>
                            <p className="text-4xl font-bold">{stats.total}</p>
                        </div>
                    </div>
                </div>

                {Object.entries(statusConfig).map(([status, config]) => (
                    config && (
                        <div key={status} className="bg-white rounded-lg shadow-md p-5 border-l-4" style={{ borderLeftColor: config.borderColor }}>
                           <div className="flex items-center gap-4">
                                <i className={`fa-solid ${config.icon} ${config.color} text-3xl w-10 text-center`}></i>
                                <div className="text-left">
                                    <p className="text-sm font-medium text-gray-500">{config.label}</p>
                                    <p className="text-3xl font-bold text-gray-800">{stats[status] || 0}</p>
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default StatisticsCard;
