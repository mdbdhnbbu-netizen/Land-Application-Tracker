
import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [resetMessage, setResetMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await onLogin(email.trim(), password.trim());
        } catch (err) {
            setError('ভুল ইমেইল বা পাসওয়ার্ড।');
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setResetMessage('');
      setLoading(true);
      try {
        await sendPasswordResetEmail(auth, email);
        setResetMessage(`পাসওয়ার্ড রিসেট করার জন্য একটি ইমেইল ${email} ঠিকানায় পাঠানো হয়েছে।`);
      } catch (err: any) {
        if(err.code === 'auth/user-not-found'){
            setError('এই ইমেইল দিয়ে কোনো একাউন্ট খুঁজে পাওয়া যায়নি।');
        } else {
            setError('পাসওয়ার্ড রিসেট করা যায়নি। আবার চেষ্টা করুন।');
        }
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-lg">
        {isResetting ? (
            <>
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-800">পাসওয়ার্ড রিসেট</h1>
                    <p className="mt-2 text-slate-600">আপনার অ্যাকাউন্টের ইমেইল দিন, আমরা পাসওয়ার্ড রিসেট করার লিংক পাঠিয়ে দেব।</p>
                </div>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                     <div>
                        <label htmlFor="email-reset" className="sr-only">ইমেইল</label>
                        <input
                            id="email-reset"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                                setResetMessage('');
                            }}
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            placeholder="ইমেইল অ্যাড্রেস"
                        />
                    </div>
                     {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                     {resetMessage && <p className="text-sm text-green-600 text-center">{resetMessage}</p>}
                     <div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                        >
                            {loading ? 'পাঠানো হচ্ছে...' : 'রিসেট লিংক পাঠান'}
                        </button>
                    </div>
                </form>
                 <div className="text-sm text-center">
                    <button onClick={() => { setIsResetting(false); setError(''); setResetMessage('')}} className="font-medium text-blue-600 hover:text-blue-500">
                        লগইন পেজে ফিরে যান
                    </button>
                </div>
            </>
        ) : (
            <>
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-800">স্বাগতম!</h1>
                    <p className="mt-2 text-slate-600">অনুগ্রহ করে আপনার ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করুন।</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="sr-only">ইমেইল</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            placeholder="ইমেইল অ্যাড্রেস"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"className="sr-only">পাসওয়ার্ড</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            placeholder="পাসওয়ার্ড"
                        />
                    </div>
                     <div className="flex items-center justify-end">
                        <div className="text-sm">
                            <button type="button" onClick={() => setIsResetting(true)} className="font-medium text-blue-600 hover:text-blue-500">
                                পাসওয়ার্ড ভুলে গেছেন?
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    <div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                        >
                            {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
                        </button>
                    </div>
                </form>
            </>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;