import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #fff;
`;

const LoginContainer = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #718096;
  margin-bottom: 40px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 14px 14px 45px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;

  &::placeholder {
    color: #a0aec0;
  }

  &:focus {
    outline: none;
    border-color: #6B46C1;
    box-shadow: 0 0 0 1px #6B46C1;
  }
`;

const Icon = styled.span`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
`;

const OptionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  font-size: 0.875rem;
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #4a5568;
`;

const Checkbox = styled.input`
  margin-right: 8px;
`;

const Link = styled.a`
  color: #6B46C1;
  text-decoration: none;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  background-color: #6B46C1;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;

  &:hover {
    background-color: #553c9a;
  }
`;

const SignupWrapper = styled.div`
  text-align: center;
  margin-top: 30px;
  font-size: 0.9rem;
  color: #4a5568;
`;

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);

        try {
            const response = await axios.post(`${API_URL}/auth/token`, params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            
            const { access_token } = response.data;
            localStorage.setItem('token', access_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            
            navigate('/main');

        } catch (err) {
            const errorMessage = err.response?.data?.detail || '로그인 중 오류가 발생했습니다.';
            setError(errorMessage);
        }
    };

    return (
        <PageWrapper>
            <LoginContainer>
                <Title>로그인</Title>
                <Subtitle>계정에 로그인하여 서비스를 이용하세요</Subtitle>
                <Form onSubmit={handleSubmit}>
                    <Label htmlFor="email">이메일</Label>
                    <InputWrapper>
                        <Icon>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        </Icon>
                        <Input type="email" id="email" placeholder="이메일을 입력하세요" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </InputWrapper>

                    <Label htmlFor="password">비밀번호</Label>
                    <InputWrapper>
                        <Icon>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        </Icon>
                        <Input type="password" id="password" placeholder="비밀번호를 입력하세요" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </InputWrapper>

                    <OptionsWrapper>
                        <CheckboxWrapper>
                            <Checkbox type="checkbox" id="keep-logged-in" />
                            로그인 상태 유지
                        </CheckboxWrapper>
                        <Link href="#">비밀번호 찾기</Link>
                    </OptionsWrapper>

                    <Button type="submit">로그인</Button>
                </Form>

                <SignupWrapper>
                    계정이 없으신가요? <Link href="#" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>회원가입</Link>
                </SignupWrapper>
            </LoginContainer>
        </PageWrapper>
    );
}

export default LoginPage; 