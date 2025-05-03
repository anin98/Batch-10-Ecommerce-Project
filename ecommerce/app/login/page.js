'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '../CallApi/auth';


export default function LoginPage() {
    const router = useRouter()
    const[credentials,setCredentials]= useState({
        username:'',
        password:''
    })
  const[loading,setLoading]= useState(false)
  const[error,setError]=useState(null)

  const handleChange = (e) =>{
    const {name,value} = e.target;
    setCredentials(prev => ({
        ...prev,
        [name]: value
    }))
  }
  
const handleSubmit = async(e) =>{
    e.preventDefault()
    try{
        setLoading(true);
        setError(null)
    
    const data = await login(credentials);
    router.push('/')
    router.refresh()
    }
catch(err){
    console.log('Login failed', err)
    setError('Invalid username or password')
}
finally{
    setLoading(false)
}

}

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Login to Your Account</h1>
        <p className="mt-2 text-gray-600">Enter your credentials to access your account</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
        <div className="mb-6">
          <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your username"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your password"
          />
        </div>
        
        <div className="mb-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-indigo-600 hover:text-indigo-500">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}