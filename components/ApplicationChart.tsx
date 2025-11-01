import React, { useEffect, useRef } from 'react';
import { Application, ApplicationStatus } from '../types';

declare const Chart: any;

interface ApplicationChartProps {
    applications: Application[];
}

const statusConfig: { [key in ApplicationStatus]?: { label: string; color: string } } = {
    [ApplicationStatus.COMPLETED]: { label: 'সম্পন্ন', color: '#22c55e' },
    [ApplicationStatus.HEARING_SCHEDULED]: { label: 'শুনানি', color: '#f97316' },
    [ApplicationStatus.DRAFT_KHATIAN]: { label: 'খসড়া খতিয়ান', color: '#eab308' },
    [ApplicationStatus.REJECTED]: { label: 'নামঞ্জুর', color: '#ef4444' },
    [ApplicationStatus.SENT_TO_ULO]: { label: 'ULO অফিসে', color: '#06b6d4' },
    [ApplicationStatus.INITIAL_APPLICATION]: { label: 'প্রাথমিক', color: '#3b82f6' },
    [ApplicationStatus.REJECTED_BY_ULO]: { label: 'ULO নামঞ্জুর', color: '#dc2626' },
    [ApplicationStatus.HEARING_COMPLETED]: { label: 'শুনানি সম্পন্ন', color: '#a855f7' },
};

const ApplicationChart: React.FC<ApplicationChartProps> = ({ applications }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<any>(null);

    useEffect(() => {
        if (!chartRef.current || !applications) return;

        // Helper function to parse 'DD/MM/YYYY' to a Date object
        const parseDate = (dateStr: string): Date | null => {
            if (!dateStr) return null;
            const parts = dateStr.split('/');
            if (parts.length !== 3) return null;
            // Month is 0-indexed in JS Dates
            return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        };

        // Helper function to get the start of the week (Monday) for a given date
        const getStartOfWeek = (date: Date): Date => {
            const d = new Date(date);
            const day = d.getDay();
            // Adjust to make Monday the first day (day === 0 is Sunday)
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            const startOfWeek = new Date(d.setDate(diff));
            startOfWeek.setHours(0, 0, 0, 0);
            return startOfWeek;
        };

        // Group applications by week and status
        const weeklyData = applications.reduce((acc, app) => {
            const appDate = parseDate(app.application_date);
            if (!appDate || isNaN(appDate.getTime())) return acc;

            const weekStart = getStartOfWeek(appDate);
            const weekKey = weekStart.toISOString().split('T')[0];

            if (!acc[weekKey]) {
                acc[weekKey] = {};
            }
            const status = app.application_status as ApplicationStatus;
            acc[weekKey][status] = (acc[weekKey][status] || 0) + 1;
            return acc;
        }, {} as Record<string, Record<string, number>>);

        const sortedWeeks = Object.keys(weeklyData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        const labels = sortedWeeks.map(week =>
            new Date(week).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' })
        );
        
        const allStatuses = Object.keys(statusConfig) as ApplicationStatus[];

        const datasets = allStatuses.map(status => {
            const config = statusConfig[status];
            return {
                label: config?.label || status,
                data: sortedWeeks.map(week => weeklyData[week]?.[status] || 0),
                backgroundColor: config?.color || '#cccccc',
            };
        });

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: false,
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        bodyFont: { family: "'Noto Sans Bengali', sans-serif" },
                        titleFont: { family: "'Noto Sans Bengali', sans-serif" }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            font: { family: "'Noto Sans Bengali', sans-serif" },
                            boxWidth: 12,
                            padding: 20,
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        ticks: {
                            font: { family: "'Noto Sans Bengali', sans-serif" }
                        }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        ticks: {
                            precision: 0 // Ensure whole numbers for counts
                        }
                    }
                },
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };

    }, [applications]);

    return (
        <div className="relative h-[350px]">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default ApplicationChart;
