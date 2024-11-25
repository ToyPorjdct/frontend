import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/authApi';
import { SignupFormType } from '../../types/SignupFormType';

const SignupForm: React.FC = () => {
  const [payload, setFormData] = useState<SignupFormType>({
    nickname: '',
    email: '',
    password: '',
  })

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signup(payload);
      navigate('/login');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div> 
      )}
      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">닉네임</label>
        <input
          type="text"
          id="nickname"
          name="nickname"
          value={payload.nickname}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
        <input
          type="email"
          id="email"
          name="email"
          value={payload.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
        <input
          type="password"
          id="password"
          name="password"
          value={payload.password}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          회원가입
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
