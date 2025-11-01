
import React, { useState, useEffect, useMemo, lazy, Suspense, useCallback } from 'react';
import { Application, ApplicationStatus, User } from './types';
import StatisticsCard from './components/StatisticsCard';
import ApplicationTable from './components/ApplicationTable';
import Pagination from './components/Pagination';
import Sidebar from './components/Sidebar';
import { FileIcon, PlusIcon, LogOutIcon, ChevronDownIcon, ChevronUpIcon, MenuIcon } from './components/Icons';
import LoginScreen from './components/LoginScreen';
import LoadingSpinner from './components/LoadingSpinner';
import ApplicationChart from './components/ApplicationChart';

// Firebase imports
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, where, writeBatch } from 'firebase/firestore';


const ApplicationDialog = lazy(() => import('./components/ApplicationDialog'));
const AddUserDialog = lazy(() => import('./components/AddUserDialog'));
const EditUserDialog = lazy(() => import('./components/EditUserDialog'));

const App: React.FC = () => {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Application; direction: 'ascending' | 'descending' } | null>({ key: 'application_date', direction: 'descending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [isAppDialogOpen, setIsAppDialogOpen] = useState(false);
    const [editingApplication, setEditingApplication] = useState<Application | null>(null);
    const [isUserAddDialogOpen, setIsUserAddDialogOpen] = useState(false);
    const [isUserEditDialogOpen, setIsUserEditDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isDashboardCollapsed, setIsDashboardCollapsed] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const ITEMS_PER_PAGE = 10;
    
    // Auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setFirebaseUser(user);
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setCurrentUser({ id: user.uid, ...userDocSnap.data() } as User);
                } else {
                    // Handle case where user exists in Auth but not in Firestore
                    console.error("User profile not found in Firestore.");
                    setCurrentUser(null);
                }
            } else {
                setFirebaseUser(null);
                setCurrentUser(null);
                setUsers([]);
                setApplications([]);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Data fetching logic
    const fetchData = useCallback(async () => {
        if (!currentUser) return;
    
        if (currentUser.role === 'Admin') {
            // Fetch all users for sidebar
            const usersQuery = query(collection(db, 'users'));
            const usersSnapshot = await getDocs(usersQuery);
            const allUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
            setUsers(allUsers);
            
            // Set initial selected user if not set
            const currentSelectedId = selectedUserId || allUsers[0]?.id || '';
            if (currentSelectedId !== selectedUserId) {
              setSelectedUserId(currentSelectedId);
            }
    
            // Fetch applications for the selected user
            if (currentSelectedId) {
                const appsQuery = query(collection(db, 'applications'), where('user_id', '==', currentSelectedId));
                const appsSnapshot = await getDocs(appsQuery);
                const userApps = appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
                setApplications(userApps);
            } else {
                setApplications([]);
            }
        } else { // Regular User
            setSelectedUserId(currentUser.id);
            const appsQuery = query(collection(db, 'applications'), where('user_id', '==', currentUser.id));
            const appsSnapshot = await getDocs(appsQuery);
            const userApps = appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
            setApplications(userApps);
        }
    }, [currentUser, selectedUserId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        setCurrentPage(1);
        setSearchTerm('');
        setStatusFilter('all');
    }, [selectedUserId]);

    const stats = useMemo(() => {
        const statusCounts = Object.values(ApplicationStatus).reduce((acc, status) => ({...acc, [status]: 0}), {} as Record<ApplicationStatus, number>);
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
        return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    };

    const processedApplications = useMemo(() => {
        let filteredData = applications.filter(item => {
            const search = searchTerm.toLowerCase();
            return (item.applicant_name.toLowerCase().includes(search) ||
                    item.application_number.toLowerCase().includes(search) ||
                    item.mouza_name.toLowerCase().includes(search) ||
                    item.case_number.toLowerCase().includes(search) ||
                    item.mobile_number.toLowerCase().includes(search)) &&
                   (statusFilter === 'all' || item.application_status === statusFilter);
        });

        if (sortConfig) {
            filteredData.sort((a, b) => {
                let comparison = 0;
                if (sortConfig.key === 'application_date' || sortConfig.key === 'hearing_date') {
                    comparison = parseDate(a[sortConfig.key]).getTime() - parseDate(b[sortConfig.key]).getTime();
                } else {
                    comparison = (a[sortConfig.key] || '').toString().localeCompare((b[sortConfig.key] || '').toString());
                }
                return sortConfig.direction === 'ascending' ? comparison : -comparison;
            });
        }
        return filteredData;
    }, [applications, searchTerm, statusFilter, sortConfig]);

    const paginatedApplications = useMemo(() => processedApplications.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [processedApplications, currentPage]);

    const handleSort = (key: keyof Application) => {
        const direction = (sortConfig?.key === key && sortConfig.direction === 'ascending') ? 'descending' : 'ascending';
        setSortConfig({ key, direction });
    };

    const handleAppSubmit = async (appData: Omit<Application, 'id' | 'user_id'> | Application) => {
        const userToCredit = users.find(u => u.id === selectedUserId) || currentUser;
        if (!userToCredit) return;
    
        const dataToSave = {
            ...appData,
            user_id: userToCredit.id,
        };
    
        if ('id' in appData && appData.id) { // Editing existing application
            const appDocRef = doc(db, 'applications', appData.id);
            await updateDoc(appDocRef, dataToSave);
        } else { // Adding new application
            const { id, ...restOfData } = dataToSave as Application; // remove id if it exists
            await addDoc(collection(db, 'applications'), restOfData);
        }
        fetchData();
    };
    
    const handleEditApp = (app: Application) => {
        setEditingApplication(app);
        setIsAppDialogOpen(true);
    };

    const handleDeleteApp = async (id: string) => {
        if(window.confirm('আপনি কি নিশ্চিত যে এই আবেদনটি মুছে ফেলতে চান?')){
            await deleteDoc(doc(db, 'applications', id));
            fetchData();
        }
    };
    
    const handleCsvExport = () => {
        const headers = ["ক্রমিক", "আবেদনের তারিখ", "আবেদনকারীর নাম", "মৌজা", "মোবাইল নম্বর", "ইউজার আইডি", "আবেদন নম্বর", "কেস নং", "বর্তমান অবস্থা", "শুনানির তারিখ", "দাখিলকারী"];
        const data = processedApplications.map((app, index) => [
            index + 1, `"${app.application_date}"`, `"${app.applicant_name}"`, `"${app.mouza_name}"`,
            `"${app.mobile_number}"`, `"${app.user_id}"`, `"${app.application_number}"`,
            `"${app.case_number}"`, `"${app.application_status}"`, `"${app.hearing_date || ''}"`, `"${app.submitter}"`
        ]);
        const csv = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(",") + "\n" + data.map(e => e.join(",")).join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csv));
        link.setAttribute("download", `applications_${users.find(u => u.id === selectedUserId)?.name || 'data'}.csv`);
        link.click();
    };

    const handleAddUser = async (email: string, name: string, role: 'Admin' | 'User', password: string) => {
        // This function now throws an error on failure, which is caught in the dialog
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser: Omit<User, 'id'> = { email, name, role };
        await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
        fetchData();
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsUserEditDialogOpen(true);
    }
    
    const handleUpdateUser = async (updatedUser: User) => {
        const userDocRef = doc(db, 'users', updatedUser.id);
        await updateDoc(userDocRef, {
            name: updatedUser.name,
            role: updatedUser.role,
        });
        fetchData();
        if (currentUser?.id === updatedUser.id) {
            setCurrentUser(updatedUser);
        }
        setIsUserEditDialogOpen(false);
        setEditingUser(null);
    }

    const handleDeleteUser = async (userId: string) => {
        if (users.length <= 1) {
            alert("আপনি একমাত্র ব্যবহারকারীকে মুছে ফেলতে পারবেন না।");
            return;
        }
        if(window.confirm('আপনি কি নিশ্চিত যে এই ব্যবহারকারীকে মুছে ফেলতে চান? তাদের সমস্ত আবেদন ডেটা মুছে যাবে। এই কাজটি ফেরানো যাবে না।')){
            // Note: This does not delete the user from Firebase Auth, only their data.
            // Deleting from Auth requires a backend function for security reasons.
            
            // Batch delete applications
            const appsQuery = query(collection(db, 'applications'), where('user_id', '==', userId));
            const appsSnapshot = await getDocs(appsQuery);
            const batch = writeBatch(db);
            appsSnapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();

            // Delete user profile from Firestore
            await deleteDoc(doc(db, 'users', userId));

            alert('ব্যবহারকারীর ডেটা মুছে ফেলা হয়েছে। নিরাপত্তা জনিত কারণে, মূল লগইন অ্যাকাউন্টটি Firebase কনসোল থেকে মুছে ফেলতে হবে।');
            
            if (selectedUserId === userId) {
                setSelectedUserId(users.find(u => u.id !== userId)?.id || '');
            }
            fetchData();
        }
    }

    const handleLogin = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };
    const handleLogout = async () => {
        await signOut(auth);
    };


    if (loading) {
        return <LoadingSpinner />;
    }

    if (!currentUser) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    const isReadOnly = currentUser.role === 'User';
    const currentUserForDisplay = users.find(u => u.id === selectedUserId);

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {!isReadOnly && (
                <Sidebar 
                    users={users} 
                    currentUserId={selectedUserId} 
                    onSelectUser={(userId) => {
                        setSelectedUserId(userId);
                        setIsSidebarOpen(false); // Close sidebar on selection in mobile
                    }} 
                    onAddNewUser={() => {
                        setIsUserAddDialogOpen(true);
                        setIsSidebarOpen(false);
                    }}
                    onEditUser={(user) => {
                        handleEditUser(user);
                        setIsSidebarOpen(false);
                    }}
                    onDeleteUser={handleDeleteUser}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
            )}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    onAddNew={() => { setEditingApplication(null); setIsAppDialogOpen(true); }} 
                    currentUser={currentUser}
                    displayUser={isReadOnly ? currentUser : currentUserForDisplay}
                    isReadOnly={isReadOnly}
                    onLogout={handleLogout}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <main className="flex-1 overflow-y-auto">
                    <div className="container mx-auto px-4 py-8 print-container">
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6 no-print">
                            <button
                                onClick={() => setIsDashboardCollapsed(prev => !prev)}
                                className="w-full flex justify-between items-center p-4 font-semibold text-slate-800 text-lg hover:bg-slate-50 rounded-t-lg focus:outline-none"
                                aria-expanded={!isDashboardCollapsed}
                                aria-controls="dashboard-content"
                            >
                                <span>ড্যাশবোর্ড ও পরিসংখ্যান</span>
                                {isDashboardCollapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
                            </button>
                            <div
                                id="dashboard-content"
                                className={`transition-all duration-500 ease-in-out overflow-hidden ${isDashboardCollapsed ? 'max-h-0' : 'max-h-[2000px]'}`}
                            >
                                <div className="p-4 md:p-6 border-t border-slate-200">
                                    {currentUser.role === 'Admin' ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            <div className="lg:col-span-2">
                                                <StatisticsCard stats={stats} />
                                            </div>
                                            <div className="lg:col-span-1 p-4 bg-slate-50/50 rounded-lg border border-slate-200/80">
                                                <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">সাপ্তাহিক আবেদনের ট্রেন্ড</h3>
                                                <ApplicationChart applications={applications} />
                                            </div>
                                        </div>
                                    ) : (
                                        <StatisticsCard stats={stats} />
                                    )}
                                </div>
                            </div>
                        </div>

                        <ApplicationTable 
                            applications={paginatedApplications}
                            totalApplications={processedApplications.length}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            onPrint={window.print}
                            onEdit={handleEditApp}
                            onDelete={handleDeleteApp}
                            onSort={handleSort}
                            sortConfig={sortConfig}
                            onStatusFilterChange={setStatusFilter}
                            onCsvExport={handleCsvExport}
                            isReadOnly={isReadOnly}
                        />
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={Math.ceil(processedApplications.length / ITEMS_PER_PAGE)}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </main>
            </div>
            {!isReadOnly && isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    aria-hidden="true"
                />
            )}
            {!isReadOnly && (
                <Suspense fallback={<LoadingSpinner />}>
                    <ApplicationDialog 
                        isOpen={isAppDialogOpen} 
                        onClose={() => setIsAppDialogOpen(false)} 
                        onSubmit={handleAppSubmit}
                        applicationToEdit={editingApplication}
                    />
                    <AddUserDialog 
                        isOpen={isUserAddDialogOpen}
                        onClose={() => setIsUserAddDialogOpen(false)}
                        onAddUser={handleAddUser}
                    />
                    {isUserEditDialogOpen && (
                         <EditUserDialog
                            isOpen={isUserEditDialogOpen}
                            onClose={() => {setIsUserEditDialogOpen(false); setEditingUser(null);}}
                            onSave={handleUpdateUser}
                            userToEdit={editingUser}
                        />
                    )}
                </Suspense>
            )}
        </div>
    );
};

const Header: React.FC<{ 
    onAddNew: () => void, 
    currentUser: User, 
    displayUser: User | undefined,
    isReadOnly?: boolean,
    onLogout: () => void,
    onMenuClick: () => void,
}> = ({ onAddNew, currentUser, displayUser, isReadOnly = false, onLogout, onMenuClick }) => (
    <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 py-3 no-print sticky top-0 z-20">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                 {!isReadOnly && (
                    <button 
                        onClick={onMenuClick} 
                        className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md"
                        aria-label="Open sidebar"
                    >
                        <MenuIcon />
                    </button>
                )}
                <div className="bg-blue-600 p-3 rounded-lg"><FileIcon /></div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">ভূমি নামজারি আবেদন ট্র্যাকার</h1>
                    <p className="text-sm text-slate-600">
                        {isReadOnly ? `স্বাগতম, ${currentUser.name}` : `নির্বাচিত ব্যবহারকারী: ${displayUser?.name || '...'}`}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                {!isReadOnly && (
                    <button onClick={onAddNew} className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 rounded-md px-6 gap-2">
                        <PlusIcon />নতুন আবেদন
                    </button>
                )}
                 <button onClick={onLogout} title={`লগ আউট (${currentUser.name})`} className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border text-slate-700 hover:bg-slate-100 h-10 rounded-md px-4 gap-2">
                    <LogOutIcon /> লগ আউট
                </button>
            </div>
        </div>
    </header>
);

export default App;