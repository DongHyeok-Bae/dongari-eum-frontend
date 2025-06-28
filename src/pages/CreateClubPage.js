// src/pages/CreateClubPage.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// API 기본 URL을 .env 파일에서 가져옵니다.
const API_URL = process.env.REACT_APP_API_URL;

// --- (이전과 동일한 Styled Components 코드) ---
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-secondary);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
`;

const Textarea = styled(Input).attrs({ as: 'textarea' })`
  min-height: 100px;
  resize: vertical;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  background-color: var(--main-blue);
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
`;


function CreateClubPage() {
    const [clubInfo, setClubInfo] = useState({ name: '', club_type: '', topic: '', description: '', password: '' });
    const [imageFile, setImageFile] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClubInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            alert("대표 이미지를 등록해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append('name', clubInfo.name);
        formData.append('club_type', clubInfo.club_type);
        formData.append('topic', clubInfo.topic);
        formData.append('description', clubInfo.description);
        formData.append('password', clubInfo.password);
        if (imageFile) formData.append('file', imageFile);

        try {
            const response = await axios.post(`${API_URL}/clubs`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                const newClub = response.data;
                navigate('/success', { 
                    state: { 
                        id: newClub.id,
                        name: newClub.name, 
                        imageUrl: newClub.image_url ? `${API_URL}/${newClub.image_url}` : null,
                        action: 'create'
                    } 
                });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.detail || '입력 내용을 다시 확인해주세요.';
            alert(`생성 실패: ${errorMessage}`);
        }
    };

    return (
        <Wrapper>
            <FormContainer>
                <Title>새로운 동아리 만들기</Title>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>동아리 이름</Label>
                        <Input type="text" name="name" onChange={handleChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label>동아리 유형</Label>
                        <Input type="text" name="club_type" placeholder="예: 연합, 교내" onChange={handleChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label>동아리 주제</Label>
                        <Input type="text" name="topic" placeholder="예: IT, 봉사, 스터디" onChange={handleChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label>한 줄 설명</Label>
                        <Textarea name="description" onChange={handleChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label>입장코드 (숫자 6자리)</Label>
                        <Input type="password" name="password" maxLength="6" onChange={handleChange} required />
                    </FormGroup>
                     <FormGroup>
                        <Label>대표 이미지</Label>
                        <Input type="file" accept="image/*" onChange={handleImageChange} required />
                    </FormGroup>
                    <SubmitButton type="submit">생성하기</SubmitButton>
                </Form>
            </FormContainer>
        </Wrapper>
    );
}

export default CreateClubPage;