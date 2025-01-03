import LoginForm from '../components/auth/LoginForm';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { memberInfo } from '../state/authState'; 

const LoginPage: React.FC = () => {
  const currentUser = useRecoilValue(memberInfo);

  useEffect(() => {
    if (currentUser?.accessToken) {
      window.location.href = '/';
    }
  }, [currentUser]);

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          로그인
        </h2>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-center">
                <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  새 계정 만들기
                </Link>
              </div>
            </div>

            <div className="mt-4">
              <a href={process.env.REACT_APP_KAKAO_URL} className="w-full block">
                <img src="./assets/kakao.png" alt="카카오로 로그인" className="w-42 mx-auto"/>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
