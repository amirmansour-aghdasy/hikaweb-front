"use client";

import React from "react";
import { HiExclamationTriangle } from "react-icons/hi2";
import { HiRefresh, HiHome } from "react-icons/hi";
import Link from "next/link";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null,
            errorInfo: null 
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }

        // Update state with error details
        this.setState({
            error,
            errorInfo
        });

        // You can also log the error to an error reporting service here
        // Example: logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({ 
            hasError: false, 
            error: null,
            errorInfo: null 
        });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
                    <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <HiExclamationTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                        
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            متأسفانه خطایی رخ داد
                        </h1>
                        
                        <p className="text-slate-600 dark:text-slate-300 mb-6">
                            متأسفانه مشکلی در نمایش این بخش پیش آمده است. لطفاً صفحه را رفرش کنید یا به صفحه اصلی برگردید.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-right">
                                <p className="text-sm font-mono text-red-800 dark:text-red-300 break-all">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200"
                            >
                                <HiRefresh className="w-5 h-5" />
                                تلاش مجدد
                            </button>
                            
                            <Link
                                href="/"
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg transition-colors duration-200"
                            >
                                <HiHome className="w-5 h-5" />
                                صفحه اصلی
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

