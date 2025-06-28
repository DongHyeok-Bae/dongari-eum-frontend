import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  min-height: 100vh;
  background-color: #fff;
`;

const SignupContainer = styled.div`
  width: 100%;
  max-width: 480px;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  color: #27ae60; /* Green */
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
  border-radius: 16px;
  font-size: 1rem;

  &::placeholder {
    color: #a0aec0;
  }

  &:focus {
    outline: none;
    border-color: #27ae60;
    box-shadow: 0 0 0 1px #27ae60;
  }
`;

const Icon = styled.span`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #4a5568;
  font-size: 0.9rem;
  margin-bottom: 30px;
`;

const Checkbox = styled.input`
  margin-right: 12px;
  width: 18px;
  height: 18px;
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 16px;
  background-color: #27ae60;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;

  &:hover {
    background-color: #229954;
  }
`;

const LoginWrapper = styled.div`
  text-align: center;
  margin-top: 30px;
  font-size: 0.9rem;
  color: #4a5568;
`;

const Link = styled.a`
  color: #27ae60;
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
  &:hover {
    text-decoration: underline;
  }
`;

function SignupPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', // 'name'으로 통합
        email: '',
        password: '',
        confirmPassword: '',
        affiliation: '', // '소속' 추가
        introduction: '', // '한 줄 소개' 추가
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            // API 요청 시 보낼 데이터
            const signupData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                affiliation: formData.affiliation,
                introduction: formData.introduction,
            };

            await axios.post(`${API_URL}/auth/signup`, signupData);

            alert('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.');
            navigate('/');

        } catch (err) {
            const errorMessage = err.response?.data?.detail || '회원가입 중 오류가 발생했습니다.';
            setError(errorMessage);
        }
    };

    return (
        <PageWrapper>
            <SignupContainer>
                <Title>회원가입</Title>
                <Subtitle>새 계정을 만들어 서비스를 시작하세요</Subtitle>
                <Form onSubmit={handleSubmit}>
                    <Label htmlFor="name">이름</Label>
                    <InputWrapper>
                        <Icon>👤</Icon>
                        <Input type="text" id="name" placeholder="이름을 입력하세요" value={formData.name} onChange={handleChange} required />
                    </InputWrapper>

                    <Label htmlFor="email">이메일</Label>
                    <InputWrapper>
                        <Icon>📧</Icon>
                        <Input type="email" id="email" placeholder="이메일을 입력하세요" value={formData.email} onChange={handleChange} required />
                    </InputWrapper>

                    <Label htmlFor="affiliation">소속</Label>
                    <InputWrapper>
                        <Icon>🏢</Icon>
                        <Input type="text" id="affiliation" placeholder="소속을 입력하세요 (선택)" value={formData.affiliation} onChange={handleChange} />
                    </InputWrapper>

                    <Label htmlFor="introduction">한 줄 소개</Label>
                    <InputWrapper>
                         <Icon>✏️</Icon>
                        <Input type="text" id="introduction" placeholder="자신을 한 줄로 소개해주세요 (선택)" value={formData.introduction} onChange={handleChange} />
                    </InputWrapper>

                    <Label htmlFor="password">비밀번호</Label>
                    <InputWrapper>
                        <Icon>🔒</Icon>
                        <Input type="password" id="password" placeholder="비밀번호를 입력하세요" value={formData.password} onChange={handleChange} required />
                    </InputWrapper>

                    <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                    <InputWrapper>
                        <Icon>🔒</Icon>
                        <Input type="password" id="confirmPassword" placeholder="비밀번호를 다시 입력하세요" value={formData.confirmPassword} onChange={handleChange} required />
                    </InputWrapper>

                    <CheckboxWrapper>
                        <Checkbox type="checkbox" id="terms" required/>
                        이용약관 및 개인정보처리방침에 동의합니다
                    </CheckboxWrapper>

                    {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}

                    <Button type="submit">회원가입</Button>
                </Form>

                <LoginWrapper>
                    이미 계정이 있으신가요?
                    <Link href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>로그인</Link>
                </LoginWrapper>
            </SignupContainer>
        </PageWrapper>
    );
}

export default SignupPage;