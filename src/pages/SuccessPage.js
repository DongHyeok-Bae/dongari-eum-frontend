// src/pages/SuccessPage.js
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
  background-color: white;
`;

const Logo = styled.img`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-bottom: 30px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 10px;
`;

const Subtitle = styled.p`
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: 40px;
`;

const HomeButton = styled.button`
    padding: 15px 40px;
    border-radius: 8px;
    background-color: var(--main-blue);
    color: white;
    font-size: 1.1rem;
    font-weight: 700;
`;

function SuccessPage() {
    const navigate = useNavigate();
    
    // 로고 이미지는 임시로 public 폴더에 넣고 사용하거나, 
    // 실제로는 동적으로 받아온 동아리 로고를 사용해야 합니다.
    // 여기서는 임시 플레이스홀더를 사용합니다.
    const logoUrl = "https://via.placeholder.com/120";

    return (
        <Wrapper>
            <Logo src={logoUrl} alt="동아리 로고" />
            <Title>구름톤 유니브</Title>
            <Subtitle>동아리 참여를 시작해요!</Subtitle>
            <HomeButton onClick={() => navigate('/')}>내 동아리 보러가기</HomeButton>
        </Wrapper>
    );
}

export default SuccessPage;