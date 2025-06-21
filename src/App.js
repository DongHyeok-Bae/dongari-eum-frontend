import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// 검색 아이콘 SVG 컴포넌트
const SearchIcon = () => (
  <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 21L16.65 16.65" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [joinPassword, setJoinPassword] = useState(['', '', '', '']);
  const passwordInputs = useRef([]);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!API_URL) {
      console.error("REACT_APP_API_URL is not set. Please check your .env file and restart the server.");
    }
  }, [API_URL]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const response = await fetch(`${API_URL}/groups/search/?name=${searchTerm}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearched(true);
    }
  };

  const handleOpenModal = (group) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
    setJoinPassword(['', '', '', '']);
  };

  const handlePasswordChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newPassword = [...joinPassword];
      newPassword[index] = value;
      setJoinPassword(newPassword);
      if (value && index < 3) {
        passwordInputs.current[index + 1].focus();
      }
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    if (!selectedGroup) return;
    const finalPassword = joinPassword.join('');
    if (finalPassword.length !== 4) {
      alert('입장코드를 모두 입력해주세요.');
      return;
    }
    
    const joinData = { name: selectedGroup.name, password: finalPassword };
    try {
      const response = await fetch(`${API_URL}/groups/join/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(joinData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '동아리 참여에 실패했습니다.');
      }
      alert(`'${selectedGroup.name}' 동아리에 성공적으로 참여했습니다!`);
      handleCloseModal();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCreateGroupRedirect = () => {
    alert("동아리 생성 기능은 아직 구현되지 않았습니다.");
    // TODO: 나중에 동아리 생성 페이지로 라우팅
    // 예: window.location.href = '/create-group';
  };

  return (
    <div className="app-wrapper">
      <header className="header-section">
        <h1 className="header-title">내 동아리를 찾아볼까요?</h1>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="검색어를 입력하세요."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon />
        </form>
      </header>

      <main className="content-section">
        {!searched ? (
          <div className="initial-message">
            <p>동아리 이름 혹은 설명을 검색해보세요!</p>
            {/* [수정됨] a 태그를 button 태그로 변경 */}
            <button onClick={handleCreateGroupRedirect} className="create-group-link-button">새로운 동아리를 만들래요!</button>
          </div>
        ) : searchResults.length > 0 ? (
          searchResults.map((group) => (
            <div key={group.id} className="search-result-item">
              <div className="group-icon"></div>
              <div className="group-info">
                <h3 className="group-name">{group.name}</h3>
                <p className="group-description">{group.description}</p>
              </div>
              <button className="join-button" onClick={() => handleOpenModal(group)}>
                참여
              </button>
            </div>
          ))
        ) : (
          <div className="no-results-message">
            <p>'{searchTerm}'에 대한 검색 결과가 없습니다.</p>
            {/* [수정됨] a 태그를 button 태그로 변경 */}
            <button onClick={handleCreateGroupRedirect} className="create-group-link-button">새로운 동아리를 직접 만들어보세요!</button>
          </div>
        )}
      </main>

      {isModalOpen && selectedGroup && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={handleCloseModal}>&times;</button>
            <div className="modal-header">
              <div className="modal-group-icon"></div>
              <h2 className="modal-group-name">{selectedGroup.name}</h2>
              <div className="modal-tags">
                <span>{selectedGroup.group_type}</span>
                <span>{selectedGroup.topic}</span>
              </div>
            </div>
            <form onSubmit={handleJoinGroup}>
              <p className="modal-join-label">입장코드</p>
              <div className="password-inputs">
                {joinPassword.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handlePasswordChange(e, index)}
                    ref={(el) => (passwordInputs.current[index] = el)}
                    required
                  />
                ))}
              </div>
              <button type="submit" className="modal-join-button">참여하기</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;