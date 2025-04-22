'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { RiLockLine, RiMailLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegisterMode = searchParams.get('mode') === 'register';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegisterMode) {
        if (password !== confirmPassword) {
          console.error('Passwords do not match');
          return;
        }
        console.log('Registering with:', { email, password });
      } else {
        console.log('Logging in with:', { email, password });
      }
      router.push('/dashboard');
    } catch (error) {
      console.error(isRegisterMode ? 'Registration failed:' : 'Login failed:', error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side with logo */}
      <div className="hidden md:flex md:w-1/2 bg-white items-center justify-center p-12">
        <Link href="/" className="block">
          <div className="max-w-[200px]">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={200}
              height={200}
              className="w-full h-auto"
              priority
            />
            <h1 className="text-blue-600 text-3xl font-bold mt-4 text-center">Class Bridge</h1>
          </div>
        </Link>
      </div>

      {/* Right side with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-blue-600">
        <div className="w-full max-w-[360px]">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {isRegisterMode ? 'Create Account' : 'Hello!'}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {isRegisterMode 
                  ? 'Please fill in your details to register' 
                  : 'Please sign in to your account'}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <RiMailLine className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <RiLockLine className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
                      required
                      className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <RiEyeOffLine className="h-5 w-5 text-gray-400" />
                      ) : (
                        <RiEyeLine className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                {isRegisterMode && (
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <RiLockLine className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isRegisterMode ? 'Sign up' : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="text-center text-sm mt-6">
              {isRegisterMode ? (
                <>
                  <span className="text-gray-600">Already have an account?</span>{' '}
                  <Link href="/auth" className="font-medium text-blue-600 hover:text-blue-700">
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-gray-600">Don&apos;t have an account?</span>{' '}
                  <Link href="/auth?mode=register" className="font-medium text-blue-600 hover:text-blue-700">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthForm />
    </Suspense>
  );
} 