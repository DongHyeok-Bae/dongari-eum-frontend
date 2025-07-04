// src/pages/MainPage.js
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// API 기본 URL을 .env 파일에서 가져옵니다.
const API_URL = process.env.REACT_APP_API_URL;

// --- (이전과 동일한 Styled Components 코드) ---
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: white;
`;

const Header = styled.header`
  width: 100%;
  padding: 80px 20px;
  background-color: var(--main-blue);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 30px;
`;

const SearchForm = styled.form`
  position: relative;
  width: 100%;
  max-width: 600px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 20px 60px 20px 30px;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  &::placeholder {
    color: #aaa;
  }
`;

const SearchIcon = styled.svg`
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  fill: #aaa;
`;

const Content = styled.main`
  width: 100%;
  max-width: 700px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InitialMessage = styled.div`
  text-align: center;
  color: var(--text-secondary);
  font-size: 1.1rem;
  padding: 50px 0;
`;

const CreateClubLink = styled.button`
  margin-top: 20px;
  color: var(--main-blue);
  font-size: 1.1rem;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
`;

const ResultsList = styled.div`
  width: 100%;
`;

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #e0e0e0;
`;

const ClubLogo = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f0f0f0;
  margin-right: 15px;
  object-fit: cover;
`;

const ClubInfo = styled.div`
  flex-grow: 1;
`;

const ClubName = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 5px 0;
`;

const ClubDescription = styled.p`
  color: var(--text-secondary);
`;

const JoinButton = styled.button`
  padding: 10px 25px;
  border-radius: 8px;
  background-color: #F0F2F5;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s;
  &:hover {
    background-color: #E4E6E8;
    color: var(--text-primary);
  }
`;

// --- Modal Styled Components ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 40px;
  border-radius: 16px;
  width: 90%;
  max-width: 480px;
  box-shadow: 0 5px 25px rgba(0,0,0,0.3);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #aaa;
`;

const ModalClubLogo = styled(ClubLogo)`
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
`;

const ModalClubName = styled(ClubName)`
  font-size: 1.8rem;
  margin-bottom: 10px;
`;

const ModalTags = styled.div`
  margin-bottom: 30px;
  span {
    background-color: #f0f0f0;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 0.9rem;
    margin: 0 5px;
  }
`;

const CodeLabel = styled.p`
  color: var(--text-secondary);
  margin-bottom: 15px;
  font-size: 1rem;
`;

const PasswordInputs = styled.div`
  display: flex;
  gap: 10px; /* 간격 살짝 줄임 */
  margin-bottom: 30px;
  input {
    width: 45px; /* 너비 살짝 줄임 */
    height: 55px; /* 높이 살짝 줄임 */
    text-align: center;
    font-size: 1.8rem; /* 폰트 크기 살짝 줄임 */
    border: 1px solid #ccc;
    border-radius: 8px;
    &:focus {
      border-color: var(--main-blue);
      outline: none;
    }
  }
`;

const ModalJoinButton = styled(JoinButton)`
  width: 100%;
  padding: 18px;
  background-color: #E7E7E7;
  color: #BDBDBD;
  font-size: 1.1rem;
  font-weight: 700;
  /* 활성화 시 스타일 */
  &.active {
    background-color: var(--main-blue);
    color: white;
  }
`;


// --- MainPage Component ---
function MainPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [password, setPassword] = useState(['', '', '', '', '', '']); // 6자리로 변경
  const passwordInputs = useRef([]);

  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/clubs?name=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("동아리 검색 실패:", error);
      alert("동아리 검색에 실패했습니다.");
    } finally {
      setIsSearched(true);
    }
  };

  const openModal = (group) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
    setPassword(['', '', '', '', '', '']); // 6자리로 변경
  };

  const handlePasswordChange = (e, index) => {
    const { value } = e.target;
    // 입력값이 숫자인 경우에만 처리하고, 값 길이는 1로 제한
    if (/^[0-9]$/.test(value)) {
      const newPassword = [...password];
      newPassword[index] = value;
      setPassword(newPassword);

      // 다음 입력창으로 포커스 이동
      if (index < 5) { // 5로 변경 (0-5 인덱스)
        passwordInputs.current[index + 1].focus();
      }
    } else if (value === '') {
        // 값이 지워졌을 때 (예: 전체선택 후 삭제)
        const newPassword = [...password];
        newPassword[index] = '';
        setPassword(newPassword);
    }
  };

  const handleKeyDown = (e, index) => {
    // 백스페이스 키를 눌렀을 때
    if (e.key === 'Backspace' && password[index] === '' && index > 0) {
      passwordInputs.current[index - 1].focus();
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (password.join('').length !== 6) return; // 6자리로 변경
    const finalPassword = password.join('');

    try {
      await axios.post(`${API_URL}/clubs/join`, { name: selectedGroup.name, password: finalPassword });
      alert('동아리 참여 요청이 완료되었습니다.'); // 실제 가입 처리는 백엔드에서...
      closeModal();
      // 필요하다면 가입 후 특정 페이지로 이동
      navigate('/success', {
        state: {
          id: selectedGroup.id,
          name: selectedGroup.name,
          imageUrl: `${API_URL}/${selectedGroup.image_url}`,
          action: 'join'
        }
      });
    } catch (error) {
        const errorMessage = error.response?.data?.detail || '알 수 없는 오류가 발생했습니다.';
        alert(`참여에 실패했습니다: ${errorMessage}`);
    }
  };

  const isJoinButtonActive = password.join('').length === 6; // 6자리로 변경

  return (
    <Wrapper>
      <Header>
        <Title>내 동아리를 찾아볼까요?</Title>
        <SearchForm onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="검색어를 입력하세요."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </SearchIcon>
        </SearchForm>
      </Header>

      <Content>
        {searchResults.length > 0 ? (
          <ResultsList>
            {searchResults.map(group => (
              <ResultItem key={group.id}>
                <ClubLogo src={`${API_URL}/${group.image_url}`} alt={group.name} />
                <ClubInfo>
                  <ClubName>{group.name}</ClubName>
                  <ClubDescription>{group.description}</ClubDescription>
                </ClubInfo>
                <JoinButton onClick={() => openModal(group)}>참여</JoinButton>
              </ResultItem>
            ))}
          </ResultsList>
        ) : (
          <InitialMessage>
            <p>{isSearched ? `'${searchTerm}'에 대한 검색 결과가 없습니다.` : '동아리 이름 혹은 설명을 검색해보세요!'}</p>
            <CreateClubLink onClick={() => navigate('/create-club')}>
              새로운 동아리를 만들래요!
            </CreateClubLink>
          </InitialMessage>
        )}
      </Content>

      {isModalOpen && selectedGroup && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            <ModalClubLogo src={`${API_URL}/${selectedGroup.image_url}`} alt={selectedGroup.name} />
            <ModalClubName>{selectedGroup.name}</ModalClubName>
            {selectedGroup.description && (
              <p style={{ color: '#888', margin: '10px 0 20px 0', textAlign: 'center' }}>{selectedGroup.description}</p>
            )}
            <ModalTags>
              {selectedGroup.club_type && <span>{selectedGroup.club_type}</span>}
              {selectedGroup.topic && <span>{selectedGroup.topic}</span>}
            </ModalTags>
            <form onSubmit={handleJoin} style={{width: '100%', display: 'contents'}}>
              <CodeLabel>입장코드</CodeLabel>
              <PasswordInputs>
                {password.map((p, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={p}
                    onChange={(e) => handlePasswordChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={el => passwordInputs.current[index] = el}
                  />
                ))}
              </PasswordInputs>
              <ModalJoinButton type="submit" className={isJoinButtonActive ? 'active' : ''} disabled={!isJoinButtonActive}>
                참여하기
              </ModalJoinButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Wrapper>
  );
}

export default MainPage;