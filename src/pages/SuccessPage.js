// src/pages/SuccessPage.js
import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

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
    const location = useLocation();
    
    // location.state가 존재하면 그 값을 사용하고, 없으면 기본값을 사용합니다.
    const { id, name, imageUrl, action } = location.state || { id: null, name: '동아리', imageUrl: null, action: '' };

    const logoUrl = imageUrl || "https://via.placeholder.com/120";
    const subtitleText = action === 'create' 
        ? '동아리 생성이 완료되었어요!' 
        : '동아리 참여가 완료되었어요!';

    const goToClubMainPage = () => {
      if (id) {
        navigate(`/club/${id}`);
      } else {
        // ID가 없는 경우, 일단 메인으로 보내거나 에러 처리를 할 수 있습니다.
        // 여기서는 검색 페이지로 돌려보냅니다.
        alert("동아리 정보를 불러올 수 없습니다. 다시 시도해주세요.");
        navigate('/search');
      }
    }

    return (
        <Wrapper>
            <Logo src={logoUrl} alt={`${name} 로고`} />
            <Title>{name}</Title>
            <Subtitle>{subtitleText}</Subtitle>
            <HomeButton onClick={goToClubMainPage}>내 동아리 보러가기</HomeButton>
        </Wrapper>
    );
}

export default SuccessPage;