import React, { useState, useEffect, useMemo } from 'react';
import { Application, ApplicationStatus } from './types';
import ApplicationDialog from './components/ApplicationDialog';
import StatisticsCard from './components/StatisticsCard';
import ApplicationTable from './components/ApplicationTable';
import Pagination from './components/Pagination';
import { FileIcon, PlusIcon } from './components/Icons';

const initialApplications: Application[] = [
    {id: 1,application_date: '22/10/2025',applicant_name: 'মোঃ রবিউল ইসলাম',mouza_name: 'বড় মাগুড়া',mobile_number: '1714324023',user_id: 'K01714324023i@',application_number: '5322649',case_number: '১৮৯৪(IX-I)/২০২৫-২৬',application_status: ApplicationStatus.REJECTED,application_copy_url: 'https://mutation.land.gov.bd/print/14aff82fa',attached_file_url: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IlpIbFRIcGN6YmR5U1VGcU9aWk5hTlRjbjJ6S1ZLZHdBa3R0YjlqdUhwdXZ6WG5NZ2NmaGNYT3VSNXFCNVhsZ3AiLCJpdiI6ImE1ZTVkYzI3MTY1N2NjOTBkNGZjYTJlZDkzNzA5MDFlIiwicyI6IjE0M2QzNDgyODY0YjEwYWYifQ==',submitter: 'জিল্লুর রহমান',status_link: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IlpIbFRIcGN6YmR5U1VGcU9aWk5hTlRjbjJ6S1ZLZHdBa3R0YjlqdUhwdXZ6WG5NZ2NmaGNYT3VSNXFCNVhsZ3AiLCJpdiI6ImE1ZTVkYzI3MTY1N2NjOTBkNGZjYTJlZDkzNzA5MDFlIiwicyI6IjE0M2QzNDgyODY0YjEwYWYifQ==',hearing_date: null},
    {id: 2,application_date: '25/10/2025',applicant_name: 'মোঃ মুনছুর আলী',mouza_name: 'হরিল্যাখুর',mobile_number: '1799160596',user_id: 'Jotty@9595',application_number: '5331148',case_number: '১৯৫২(IX-I)/২০২৫-২৬',application_status: ApplicationStatus.SENT_TO_ULO,application_copy_url: 'https://mutation.land.gov.bd/print/14b00cefc',attached_file_url: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6InF0WG1ZeHQ3UVgrWFF5NWFyWUhWU1dwNTdTZWRSOXh5L2p5Q0x5RGtoLzByVXVpb1VycXFVR3dBSUs4QXNIS1IiLCJpdiI6Ijg4YWVkNDQ3MTZjYzllYWE2NDRhODg1NTgzMjY4NmUwIiwicyI6IjcyODExZjViOTQ2Y2QxN2EifQ==',submitter: 'ফিরোজ কবির',status_link: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6InF0WG1ZeHQ3UVgrWFF5NWFyWUhWU1dwNTdTZWRSOXh5L2p5Q0x5RGtoLzByVXVpb1VycXFVR3dBSUs4QXNIS1IiLCJpdiI6Ijg4YWVkNDQ3MTZjYzllYWE2NDRhODg1NTgzMjY4NmUwIiwicyI6IjcyODExZjViOTQ2Y2QxN2EifQ==',hearing_date: null},
    {id: 3,application_date: '19/10/2025',applicant_name: 'মোঃ মশফিকুর রহমান খাঁন',mouza_name: 'খামার দেবীপুর',mobile_number: '1719513495',user_id: '01719513495',application_number: '৫৩১১২৯৮',case_number: '১৮৪৩(IX-I)/২০২৫-২৬',application_status: ApplicationStatus.DRAFT_KHATIAN,application_copy_url: 'https://mutation.land.gov.bd/QrScanner/KhatianDownload/MTc2MTIyNDIyMF81MzExMjk4/MTc2MTIyNDIyMF82/14afdc798',attached_file_url: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6Ii9XK1BieFhFY3E0WkZOWXdZYW9yUDIxeVMrM243NjZESVA2YXhWV0N0RmxGMnNIamdhWlRpeHhqZDhRTnU5WkMiLCJpdiI6IjM4OWYwNjE2ZDUxODcyNGZiM2QwNjNmMmIyNTdkZjY2IiwicyI6Ijk4MTgzMGZiYThkZWQ5NTgifQ==',submitter: 'ফিরোজ কবির',status_link: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6Ii9XK1BieFhFY3E0WkZOWXdZYW9yUDIxeVMrM243NjZESVA2YXhWV0N0RmxGMnNIamdhWlRpeHhqZDhRTnU5WkMiLCJpdiI6IjM4OWYwNjE2ZDUxODcyNGZiM2QwNjNmMmIyNTdkZjY2IiwicyI6Ijk4MTgzMGZiYThkZWQ5NTgifQ==',hearing_date: null},
    {id: 4,application_date: '23/10/2025',applicant_name: 'মোছাঃ মোফছারিনা বেগম গং',mouza_name: 'তর্পনঘাট',mobile_number: '1765906054',user_id: 'M01765906054b@',application_number: '৫৩২৫৮৭৫',case_number: '১৯২০(IX-I)/২০২৫-২৬',application_status: ApplicationStatus.REJECTED,application_copy_url: 'https://mutation.land.gov.bd/print/14b0000fe',attached_file_url: 'https://drive.google.com/drive/folders/1sUowSQteTFDfwhSbGykspDsYtfM-kJrN?usp=sharing',submitter: 'জিল্লুর রহমান',status_link: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IkMvOWtDL3RWLzJDaXJQVTRuQ0VtbVJLamdxQTV0NFd3WmM0akwxWVFYT0ErTXkvZlQ4MGt0R211YWNXdXFuRjEiLCJpdiI6Ijk4YmZlNDUzZGMzYWM2Njc2MWZiM2YwZDkxZWEwZTYzIiwicyI6IjNlNGI0M2RjZGNhZmZhZmIifQ==',hearing_date: null},
    {id: 5,application_date: '22/10/2025',applicant_name: 'মোঃ চাঁন মিয়া',mouza_name: 'তেঘড়া',mobile_number: '1794810624',user_id: 'C01794810624m@',application_number: '৫৩২৩২৮৮',case_number: '১৯০৩(IX-I)/২০২৫-২৬',application_status: ApplicationStatus.DRAFT_KHATIAN,application_copy_url: 'https://mutation.land.gov.bd/print/14aff9bf0',attached_file_url: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IkJBRFVNSS81bXd4V3g5R0JVZXJRRS95NmtSdFNzQ0FHMHZYMndCa2pMMGkvZit3bkVzTEQ3SXNwNUxqMlRnNkEiLCJpdiI6IjRiMTAxNDI2MWZkNzkxMDU1NjU1MzVkMDhkZDFjZWYxIiwicyI6IjZkZWE2Y2ZlZWM3ZjZkNzgifQ==',submitter: 'ফিরোজ কবির',status_link: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IkJBRFVNSS81bXd4V3g5R0JVZXJRRS95NmtSdFNzQ0FHMHZYMndCa2pMMGkvZit3bkVzTEQ3SXNwNUxqMlRnNkEiLCJpdiI6IjRiMTAxNDI2MWZkNzkxMDU1NjU1MzVkMDhkZDFjZWYxIiwicyI6IjZkZWE2Y2ZlZWM3ZjZkNzgifQ==',hearing_date: null},
    {id: 6,application_date: '21/10/2025',applicant_name: 'মোঃ আহ্সান হাবীব',mouza_name: 'জগন্নাথপুর',mobile_number: '1710718931',user_id: 'A01710718931a@',application_number: '৫৩১৭৫৬৩',case_number: '১৮৬৬(IX-I)/২০২৫-২৬',application_status: ApplicationStatus.DRAFT_KHATIAN,application_copy_url: 'https://mutation.land.gov.bd/print/14afebc51',attached_file_url: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IjlsY2F1OGtBTlcrREViRUZYWjEveTRDTDVhQ09CbFRkTG9JWW1lMi83MmcwbDYzR3QvNnl2RVVWVVJxbTF5TG9MQmtrcjdHT1JEYzAxTFFmMjJDODFsenZmcVpTajBzUkNOR3ZVdTl3SjhzPSIsIml2IjoiNTNkNjExNDBlMzI0ZmZmZTA3NGE4Mjc4NDk4NjU4NWUiLCJzIjoiNzYyYWU2YmI2YWMzMzU0YiJ9',submitter: 'জিল্লুর রহমান',status_link: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IjlsY2F1OGtBTlcrREViRUZYWjEveTRDTDVhQ09CbFRkTG9JWW1lMi83MmcwbDYzR3QvNnl2RVVWVVJxbTF5TG9MQmtrcjdHT1JEYzAxTFFmMjJDODFsenZmcVpTajBzUkNOR3ZVdTl3SjhzPSIsIml2IjoiNTNkNjExNDBlMzI0ZmZmZTA3NGE4Mjc4NDk4NjU4NWUiLCJzIjoiNzYyYWU2YmI2YWMzMzU0YiJ9',hearing_date: null},
    {id: 7,application_date: '19/10/2025',applicant_name: 'বিনোদ মরমু (জাহাঙ্গীর)',mouza_name: 'চকজুনিত',mobile_number: '1723912814',user_id: 'A01723912814a@',application_number: '৫৩১১১৫৭',case_number: '১৮৪২(IX-I)/২০২৫-২৬',application_status: ApplicationStatus.DRAFT_KHATIAN,application_copy_url: 'https://mutation.land.gov.bd/print/14afdc216',attached_file_url: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IlhJOWk3NFU0cjI2aFYyMThUdTZXak5Oc2N5YjhtOW9lSC9Lb25NU0luS0dQdjhNNlhiamNDWTlTMjg4K1A1WEEiLCJpdiI6IjkwYmJkNTMyNmFkOGIxMjI0NDJmNTc4MzliZDg3NWE3IiwicyI6IjZmNzgyNDg0OTQ1MGYwNWMifQ==',submitter: 'ফিরোজ কবির',status_link: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IlhJOWk3NFU0cjI2aFYyMThUdTZXak5Oc2N5YjhtOW9lSC9Lb25NU0luS0dQdjhNNlhiamNDWTlTMjg4K1A1WEEiLCJpdiI6IjkwYmJkNTMyNmFkOGIxMjI0NDJmNTc4MzliZDg3NWE3IiwicyI6IjZmNzgyNDg0OTQ1MGYwNWMifQ==',hearing_date: null},
    {id: 8,application_date: '12/10/2025',applicant_name: 'মোঃ নাসিরুল ইসলাম',mouza_name: 'কুড়াহার',mobile_number: '1710629199',user_id: 'A01746131527a@',application_number: '৫২৮৬৯৩৫',case_number: '১৭৩৩(IX-I)/২০২৫-২৬',application_status: ApplicationStatus.HEARING_SCHEDULED,application_copy_url: 'https://mutation.land.gov.bd/print/14afa0fe9',attached_file_url: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6InNTeWxsTzUxQnZQaGFuNkpzQVROVFB5S2pObkpNUWF1SFlzNnhJaGpYYThIUWJjVzRteTdNUTdNVzgrc2FzWmgiLCJpdiI6ImM1MjMyN2JlMThlY2I4M2ZjZDU0OTc3NDljNzc1NDI2IiwicyI6ImE3NTRhZjA2ZDM3YjhhYmYifQ==',submitter: 'ফিরোজ কবির',status_link: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6InNTeWxsTzUxQnZQaGFuNkpzQVROVFB5S2pObkpNUWF1SFlzNnhJaGpYYThIUWJjVzRteTdNUTdNVzgrc2FzWmgiLCJpdiI6ImM1MjMyN2JlMThlY2I4M2ZjZDU0OTc3NDljNzc1NDI2IiwicyI6ImE3NTRhZjA2ZDM3YjhhYmYifQ==',hearing_date: '30/10/2025'},
    {id: 9,application_date: '15/10/2025',applicant_name: 'মোঃ দেলোয়ার হোসেন',mouza_name: 'জগন্নাথপুর',mobile_number: '1839969928',user_id: 'D01839969928h@',application_number: '৫২৯৭১৮২',case_number: '১৭৮৭(IX-I)/২০২৫-২৬',application_status: ApplicationStatus.DRAFT_KHATIAN,application_copy_url: 'https://mutation.land.gov.bd/print/14afba02f',attached_file_url: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IjE0UzBScDErT1lPRUZVWEhKUzI5YkFPVnBXTWZnL3FaeUljRTZub2tSSEZkdjNaM05iSU9iVFlhdGwyQmVSbWQiLCJpdiI6ImUyZGZhMmMxYjYzN2U5NTE3N2Y3NWQ0OTMzMmVkNTg3IiwicyI6IjA1YzlmZDE3ZjM3N2IyZDQifQ==',submitter: 'জিল্লুর রহমান',status_link: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IjE0UzBScDErT1lPRUZVWEhKUzI5YkFPVnBXTWZnL3FaeUljRTZub2tSSEZkdjNaM05iSU9iVFlhdGwyQmVSbWQiLCJpdiI6ImUyZGZhMmMxYjYzN2U5NTE3N2Y3NWQ0OTMzMmVkNTg3IiwicyI6IjA1YzlmZDE3ZjM3N2IyZDQifQ==',hearing_date: null},
    {id: 10,application_date: '14/10/2025',applicant_name: 'মোঃ মুনছুর আলী',mouza_name: 'হরিল্ল্যাখুর',mobile_number: '1799160596',user_id: 'Jotty@9595',application_number: '৫২৯৫১৯৬',case_number: '১৭৮২(IX-I)/২০২৫-২৬',application_status: ApplicationStatus.REJECTED,application_copy_url: 'https://mutation.land.gov.bd/print/14afb529c',attached_file_url: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IjFPNHdRR3NySVQzOXFUWDZoVWUzQlM4WDQ3M2RvTkJra2J4TE5zYXRHMGg3TXpuaHNXYTVvQzFUbkJLNDRzVzAiLCJpdiI6IjgwY2Q2NWFlY2M3MDQxY2FjMzNjOTU1ZjY5MzU1MDgyIiwicyI6IjdkODEwNDEyZjdlOGYzMzAifQ==',submitter: 'বাধন',status_link: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IjFPNHdRR3NySVQzOXFUWDZoVWUzQlM4WDQ3M2RvTkJra2J4TE5zYXRHMGg3TXpuaHNXYTVvQzFUbkJLNDRzVzAiLCJpdiI6IjgwY2Q2NWFlY2M3MDQxY2FjMzNjOTU1ZjY5MzU1MDgyIiwicyI6IjdkODEwNDEyZjdlOGYzMzAifQ==',hearing_date: null},
    {id: 11,application_date: '12/10/2025',applicant_name: 'মাসুদ রানা সৌরভ গং',mouza_name: 'রতনপুর',mobile_number: '1839393666',user_id: 'S01839393666s@',application_number: '৫২৮৭১৪৪',case_number: '১৭ ৩৪(IX-I)/২০২৫-২৬',application_status: ApplicationStatus.DRAFT_KHATIAN,application_copy_url: 'https://mutation.land.gov.bd/print/14afa1812',attached_file_url: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IktBOHl0WG5uMXFGY1dTRDh4SUswZjN0ZlcrTmxrTmlTSGZWZUo2SEp0ZGlpLy96SGc2eHIyYmtja0FIUnNkaVkiLCJpdiI6ImVmODUwOTc5YjYxMTdiNGZkMDk5NWIxZDc4YzdkODE3IiwicyI6IjYwMjQ1YzIyZjEwMDk3MTEifQ==',submitter: 'ফিরোজ কবির',status_link: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IktBOHl0WG5uMXFGY1dTRDh4SUswZjN0ZlcrTmxrTmlTSGZWZUo2SEp0ZGlpLy96SGc2eHIyYmtja0FIUnNkaVkiLCJpdiI6ImVmODUwOTc5YjYxMTdiNGZkMDk5NWIxZDc4YzdkODE3IiwicyI6IjYwMjQ1YzIyZjEwMDk3MTEifQ==',hearing_date: null},
    {id: 12,application_date: '08/10/2025',applicant_name: 'মোঃ মাসুদ রানা সৌরভ',mouza_name: 'রতনপুর',mobile_number: '1839393666',user_id: 'S01839393666s@',application_number: '৫২৭৫৯০২',case_number: '১৬৫৮(IX-I)/২০২৫-২৬',application_status: ApplicationStatus.COMPLETED,application_copy_url: 'https://mutation.land.gov.bd/print/14af860ed',attached_file_url: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IlUrRkczUlRvL05BQXhwa1dvNGdkZVBZSVFJTFB4K0xleTljbTVRYk55bUdGNWRtTGhCZTdPUGp1OHNqb2xobFYiLCJpdiI6Ijg4ZTA1ZDU4NDg2NTQ2NjU0OWIxOGE2MDYwMGU0ZGZmIiwicyI6IjY4NWNmYmRkMmZmYTI1M2QifQ==',submitter: 'বাধন',status_link: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IlUrRkczUlRvL05BQXhwa1dvNGdkZVBZSVFJTFB4K0xleTljbTVRYk55bUdGNWRtTGhCZTdPUGp1OHNqb2xobFYiLCJpdiI6Ijg4ZTA1ZDU4NDg2NTQ2NjU0OWIxOGE2MDYwMGU0ZGZmIiwicyI6IjY4NWNmYmRkMmZmYTI1M2QifQ==',hearing_date: null},
    {id: 13,application_date: '09/10/2025',applicant_name: 'মোঃ আল ইমরান',mouza_name: 'টাকামতি',mobile_number: '1774234851',user_id: 'A01774234851a@',application_number: '৫২৮০০২৫',case_number: '১৬৯১(IX-I)/২০২৫-২৬',application_status: ApplicationStatus.HEARING_COMPLETED,application_copy_url: 'https://mutation.land.gov.bd/print/14af901fd',attached_file_url: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6ImlYVm1UMkY4dTJMTHVMSGdSMFVHczhQWG5IWnFMSlZJVFFvUm1xRGpoOEJrbXFUaXFBbEdZTENSV3MycVp0Ym8iLCJpdiI6ImY2N2JlODEzNzk2YTBmODdlYTNiZDBhYWY4OWJjNzliIiwicyI6ImU3ZTBlODliOGUwYjgwMzIifQ==',submitter: 'বাধন',status_link: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6ImlYVm1UMkY4dTJMTHVMSGdSMFVHczhQWG5IWnFMSlZJVFFvUm1xRGpoOEJrbXFUaXFBbEdZTENSV3MycVp0Ym8iLCJpdiI6ImY2N2JlODEzNzk2YTBmODdlYTNiZDBhYWY4OWJjNzliIiwicyI6ImU3ZTBlODliOGUwYjgwMzIifQ==',hearing_date: null},
    {id: 14,application_date: '08/10/2025',applicant_name: 'মোঃ ছালা উদ্দিন মাছুদ',mouza_name: 'গাজীপুর',mobile_number: '1862118497',user_id: 'S01862118497s@',application_number: '৫২৭৫৬৪৬',case_number: '১৬৫৫(IX-I)/২০২৫-২৬',application_status: ApplicationStatus.COMPLETED,application_copy_url: 'https://mutation.land.gov.bd/print/14af856ee',attached_file_url: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IkVXa1ZtbVdDQjlteXdaNmRsQ1UrRkRuZmx1NkM2dTFRWVV6eE9TcFdrUzVJcUdrZXNPbmUrcm1hYmJ6NjNpaFIiLCJpdiI6IjE2NjA5NTVlZjljZTI1NTU0NTdlNDhkOWE5ODczMWIzIiwicyI6IjdjZmRjOGZjZGU4ZTA2YmQifQ==',submitter: 'ফিরোজ কবির',status_link: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IkVXa1ZtbVdDQjlteXdaNmRsQ1UrRkRuZmx1NkM2dTFRWVV6eE9TcFdrUzVJcUdrZXNPbmUrcm1hYmJ6NjNpaFIiLCJpdiI6IjE2NjA5NTVlZjljZTI1NTU0NTdlNDhkOWE5ODczMWIzIiwicyI6IjdjZmRjOGZjZGU4ZTA2YmQifQ==',hearing_date: null},
    {id: 15,application_date: '08/10/2025',applicant_name: 'মোঃ জাহাঙ্গীর আলম',mouza_name: 'জগন্নাথপুর',mobile_number: '1725301424',user_id: 'J01725301424a@',application_number: '৫২৭৫০০৯',case_number: '১৬৫০(IX-I)/২০২৫-২৬',application_status: ApplicationStatus.HEARING_SCHEDULED,application_copy_url: 'https://mutation.land.gov.bd/print/14af83e0a',attached_file_url: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6InVnTW4rMXBBelNOb28zUkZ3WTd3QnR5ZTdFSjRRYTEydkFXN1p6QTdEdXNBOHhWWDcxNXYrU2t2Y0NGa211U2giLCJpdiI6IjczNWYyMTRmZTllODMwNTk2ZGI3ZTViYzBkNzAzYjBiIiwicyI6ImZmZTMxZTgwYzMxOTQyMTUifQ==',submitter: 'ফিরোজ কবির',status_link: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6InVnTW4rMXBBelNOb28zUkZ3WTd3QnR5ZTdFSjRRYTEydkFXN1p6QTdEdXNBOHhWWDcxNXYrU2t2Y0NGa211U2giLCJpdiI6IjczNWYyMTRmZTllODMwNTk2ZGI3ZTViYzBkNzAzYjBiIiwicyI6ImZmZTMxZTgwYzMxOTQyMTUifQ==',hearing_date: '27/10/2025'},
    {id: 16,application_date: '08/10/2025',applicant_name: 'মোঃ আসাদুজ্জামান',mouza_name: 'লোকা',mobile_number: '1870959033',user_id: 'A01870959033a@',application_number: '৫২৭৪৩২১',case_number: '১৬৪৭(IX-I)/২০২৫-২৬',application_status: ApplicationStatus.COMPLETED,application_copy_url: 'https://mutation.land.gov.bd/print/14af8232b',attached_file_url: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6ImlrTGdJajVJbGl6V0VMbkZONnZaclk4K1RKZjhUeXFLVVNIK3JPNm50dTg4TDRhM2FGYlVkeUNOQm5mZmxNZ0kiLCJpdiI6IjU5M2QwYTk4MWE2ZmVhZTJjYWRlOTBiMDgzNWQ0NThiIiwicyI6IjUxNmQzNDE5Mzg0ZTM2N2QifQ==',submitter: 'ফিরোজ কবির',status_link: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6ImlrTGdJajVJbGl6V0VMbkZONnZaclk4K1RKZjhUeXFLVVNIK3JPNm50dTg4TDRhM2FGYlVkeUNOQm5mZmxNZ0kiLCJpdiI6IjU5M2QwYTk4MWE2ZmVhZTJjYWRlOTBiMDgzNWQ0NThiIiwicyI6IjUxNmQzNDE5Mzg0ZTM2N2QifQ==',hearing_date: null},
    {id: 17,application_date: '07/10/2025',applicant_name: 'মোঃ আরিফুল ইসলাম আরিফ',mouza_name: 'বড় মহেশপুর',mobile_number: '1725578312',user_id: 'A01725578312i@',application_number: '৫২৭১২৬২',case_number: '১৬৩২(IX-I)/২০২৫-২৬',application_status: ApplicationStatus.COMPLETED,application_copy_url: 'https://mutation.land.gov.bd/print/14af7abae',attached_file_url: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IkZrSUliUXIySWt4NTU3TUY5WUd4ZFBlKy9sNTZrcHo5M2Z6emJ1WVBXT009IiwiaXYiOiJmYjlhNzk2ZDFkZTcyNDg2NDhhNjA1YTQ5ODQxYWRlNyIsInMiOiI1NTJmMmE1YmMxMmRlZjBlIn0=',submitter: 'এডমিন',status_link: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IkZrSUliUXIySWt4NTU3TUY5WUd4ZFBlKy9sNTZrcHo5M2Z6emJ1WVBXT009IiwiaXYiOiJmYjlhNzk2ZDFkZTcyNDg2NDhhNjA1YTQ5ODQxYWRlNyIsInMiOiI1NTJmMmE1YmMxMmRlZjBlIn0=',hearing_date: null},
    {id: 18,application_date: '07/10/2025',applicant_name: 'মোঃ আব্দুল কাদের',mouza_name: 'কৃষ্ণজীবনপুর',mobile_number: '1721786359',user_id: 'A01721786359a@',application_number: '৫২৭১০৩৬',case_number: '১৬৩১(IX-I)/২০২৫-২৬',application_status: ApplicationStatus.COMPLETED,application_copy_url: 'https://mutation.land.gov.bd/print/14af7a2d8',attached_file_url: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IjJkQkZxd3o1dXZGcTJEcG15VnM2ZWJJY3JtN3l1WHRhRzlvWTBmSjlWbjljNytxNmxNRUFjeisvcGVPWVVINkEiLCJpdiI6ImIwZWUyNzMyM2YzMjIyYzUyMTA4NDFhOTNiODJiZDI3IiwicyI6IjNlNGU1MTliNGYyNTI0OGEifQ==',submitter: 'ফিরোজ কবির',status_link: 'https://mutation.land.gov.bd/search-application?data=eyJjdCI6IjJkQkZxd3o1dXZGcTJEcG15VnM2ZWJJY3JtN3l1WHRhRzlvWTBmSjlWbjljNytxNmxNRUFjeisvcGVPWVVINkEiLCJpdiI6ImIwZWUyNzMyM2YzMjIyYzUyMTA4NDFhOTNiODJiZDI3IiwicyI6IjNlNGU1MTliNGYyNTI0OGEifQ==',hearing_date: null},
];


const App: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>(() => {
        try {
            const savedApplications = localStorage.getItem('namjariApplications');
            if (savedApplications) {
                return JSON.parse(savedApplications);
            }
        } catch (error) {
            console.error("Could not load applications from localStorage", error);
        }
        return initialApplications;
    });
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Application; direction: 'ascending' | 'descending' } | null>({ key: 'application_date', direction: 'descending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingApplication, setEditingApplication] = useState<Application | null>(null);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        localStorage.setItem('namjariApplications', JSON.stringify(applications));
    }, [applications]);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const stats = useMemo(() => {
        const statusCounts = Object.values(ApplicationStatus).reduce((acc, status) => {
            acc[status] = 0;
            return acc;
        }, {} as Record<ApplicationStatus, number>);

        applications.forEach(app => {
            if (app.application_status in statusCounts) {
                statusCounts[app.application_status as ApplicationStatus]++;
            }
        });
        return { total: applications.length, ...statusCounts };
    }, [applications]);

    const parseDate = (dateStr: string | null) => {
        if (!dateStr) return new Date(0);
        const parts = dateStr.split('/');
        if (parts.length !== 3) return new Date(0);
        const [day, month, year] = parts.map(Number);
        return new Date(year, month - 1, day);
    };

    const processedApplications = useMemo(() => {
        let filteredData = applications.filter(item => {
            const lowercasedFilter = searchTerm.toLowerCase();
            const matchesSearch = (
                item.applicant_name.toLowerCase().includes(lowercasedFilter) ||
                item.application_number.toLowerCase().includes(lowercasedFilter) ||
                item.mouza_name.toLowerCase().includes(lowercasedFilter) ||
                item.case_number.toLowerCase().includes(lowercasedFilter) ||
                item.mobile_number.toLowerCase().includes(lowercasedFilter)
            );
            const matchesStatus = statusFilter === 'all' || item.application_status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        if (sortConfig !== null) {
            filteredData.sort((a, b) => {
                if (sortConfig.key === 'application_date' || sortConfig.key === 'hearing_date') {
                    const dateA = parseDate(a[sortConfig.key] as string | null);
                    const dateB = parseDate(b[sortConfig.key] as string | null);
                    if (dateA < dateB) return sortConfig.direction === 'ascending' ? -1 : 1;
                    if (dateA > dateB) return sortConfig.direction === 'ascending' ? 1 : -1;
                    return 0;
                } else {
                    const valA = a[sortConfig.key];
                    const valB = b[sortConfig.key];
                    if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
                    if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
                    return 0;
                }
            });
        }
        return filteredData;
    }, [applications, searchTerm, statusFilter, sortConfig]);

    const totalPages = Math.ceil(processedApplications.length / ITEMS_PER_PAGE);

    const paginatedApplications = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return processedApplications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [processedApplications, currentPage]);

    const handleSort = (key: keyof Application) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleAddApplication = (app: Omit<Application, 'id'>) => {
        const newApp = { ...app, id: Date.now() };
        setApplications(prev => [newApp, ...prev]);
    };
    
    const handleUpdateApplication = (updatedApp: Application) => {
        setApplications(prev => prev.map(app => app.id === updatedApp.id ? updatedApp : app));
    };

    const handleSubmit = (appData: Omit<Application, 'id'> | Application) => {
        if ('id' in appData) {
            handleUpdateApplication(appData);
        } else {
            handleAddApplication(appData);
        }
    };
    
    const handleEdit = (app: Application) => {
        setEditingApplication(app);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        if(window.confirm('আপনি কি নিশ্চিত যে এই আবেদনটি মুছে ফেলতে চান?')){
            setApplications(prev => prev.filter(app => app.id !== id));
        }
    };
    
    const handleCsvExport = () => {
        const headers = ["ক্রমিক", "আবেদনের তারিখ", "আবেদনকারীর নাম", "মৌজা", "মোবাইল নম্বর", "ইউজার আইডি", "আবেদন নম্বর", "কেস নং", "বর্তমান অবস্থা", "শুনানির তারিখ", "দাখিলকারী"];
        const data = processedApplications.map((app, index) => [
            index + 1,
            `"${app.application_date}"`,
            `"${app.applicant_name}"`,
            `"${app.mouza_name}"`,
            `"${app.mobile_number}"`,
            `"${app.user_id}"`,
            `"${app.application_number}"`,
            `"${app.case_number}"`,
            `"${app.application_status}"`,
            `"${app.hearing_date || ''}"`,
            `"${app.submitter}"`
        ]);

        let csvContent = "data:text/csv;charset=utf-8,\uFEFF"
            + headers.join(",") + "\n"
            + data.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "applications.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const openAddDialog = () => {
        setEditingApplication(null);
        setIsDialogOpen(true);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto px-4 py-8 print-container">
                <Header onAddNew={openAddDialog} />
                <StatisticsCard stats={stats} />
                <ApplicationTable 
                    applications={paginatedApplications}
                    totalApplications={processedApplications.length}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onPrint={window.print}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                    onStatusFilterChange={setStatusFilter}
                    onCsvExport={handleCsvExport}
                />
                 <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
            <ApplicationDialog 
                isOpen={isDialogOpen} 
                onClose={() => setIsDialogOpen(false)} 
                onSubmit={handleSubmit}
                applicationToEdit={editingApplication}
            />
        </main>
    );
};

const Header: React.FC<{ onAddNew: () => void }> = ({ onAddNew }) => (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6 no-print">
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-3 rounded-lg"><FileIcon /></div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">ভূমি নামজারি আবেদন ট্র্যাকার</h1>
                    <p className="text-sm text-slate-600">আপনার সমস্ত নামজারি আবেদনগুলি সহজে অনুসন্ধান এবং পরিচালনা করুন</p>
                </div>
            </div>
            <button onClick={onAddNew} className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 rounded-md px-6 gap-2">
                <PlusIcon />নতুন আবেদন
            </button>
        </div>
    </div>
);

export default App;
