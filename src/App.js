import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  // 동아리 생성을 위한 상태(State) 변수들
  const [createName, setCreateName] = useState('');
  const [createType, setCreateType] = useState('');
  const [createTopic, setCreateTopic] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createPassword, setCreatePassword] = useState('');

  // 동아리 검색을 위한 상태 변수들
  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // --- 모달 관련 상태 변수들 ---
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달이 열렸는지 여부
  const [selectedGroup, setSelectedGroup] = useState(null); // 사용자가 선택한 동아리 정보
  const [joinPassword, setJoinPassword] = useState(['', '', '', '']); // 모달의 비밀번호 입력값
  const passwordInputs = useRef([]);

  // 동아리 생성 폼 제출 시 호출될 함수
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    const groupData = { name: createName, group_type: createType, topic: createTopic, description: createDescription, password: createPassword };
    try {
      const response = await fetch('${process.env.REACT_APP_API_URL}/groups/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(groupData) });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '동아리 생성에 실패했습니다.');
      }
      const newGroup = await response.json();
      alert(`'${newGroup.name}' 동아리가 성공적으로 생성되었습니다!`);
      setCreateName(''); setCreateType(''); setCreateTopic(''); setCreateDescription(''); setCreatePassword('');
    } catch (error) {
      alert(error.message);
    }
  };

  // 동아리 검색 폼 제출 시 호출될 함수
  const handleSearchGroup = async (e) => {
    e.preventDefault();
    if (!searchName.trim()) {
      alert('검색할 동아리 이름을 입력해주세요.');
      return;
    }
    try {
      const response = await fetch(`<span class="math-inline">\{process\.env\.REACT\_APP\_API\_URL\}/groups/search/?name=${searchName}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '동아리 검색에 실패했습니다.');
      }
      const foundGroups = await response.json();
      setSearchResults(foundGroups);
    } catch (error) {
      alert(error.message);
    }
  };

  // --- 모달 관련 함수들 ---

  // '참여' 버튼 클릭 시 모달을 여는 함수
  const handleOpenModal = (group) => {
    setSelectedGroup(group); // 어떤 동아리를 선택했는지 저장
    setIsModalOpen(true);    // 모달을 화면에 표시
  };

  // 모달을 닫는 함수
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
    setJoinPassword(['', '', '', '']); // 비밀번호 초기화
  };

  // 모달에서 비밀번호 입력 시 처리하는 함수
  const handlePasswordChange = (e, index) => {
    const newPassword = [...joinPassword];
    newPassword[index] = e.target.value;
    setJoinPassword(newPassword);

    // 다음 입력칸으로 자동 포커스 이동
    if (e.target.value && index < 3) {
      passwordInputs.current[index + 1].focus();
    }
  };
  
  // 모달에서 '참여하기' 버튼 클릭 시 호출될 함수
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
      const response = await fetch('${process.env.REACT_APP_API_URL}/groups/join/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(joinData) });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '동아리 참여에 실패했습니다.');
      }
      alert(`'${selectedGroup.name}' 동아리에 성공적으로 참여했습니다!`);
      handleCloseModal(); // 성공 시 모달 닫기
    } catch (error) {
      alert(error.message);
    }
  };


  return (
    <div className="App">
      <div className="container">
        <h2>동아리 생성</h2>
        <form onSubmit={handleCreateGroup}>
          <input type="text" value={createName} onChange={(e) => setCreateName(e.target.value)} placeholder="동아리 이름" required />
          <input type="text" value={createType} onChange={(e) => setCreateType(e.target.value)} placeholder="동아리 유형 (예: 스터디, 프로젝트)" required />
          <input type="text" value={createTopic} onChange={(e) => setCreateTopic(e.target.value)} placeholder="주제 (예: React, 알고리즘)" required />
          <input type="text" value={createDescription} onChange={(e) => setCreateDescription(e.target.value)} placeholder="간단한 설명" />
          <input type="password" value={createPassword} onChange={(e) => setCreatePassword(e.target.value)} placeholder="4자리 숫자 비밀번호" required />
          <button type="submit">생성하기</button>
        </form>
      </div>

      <div className="container">
        <h2>동아리 검색</h2>
        <form onSubmit={handleSearchGroup}>
          <input type="text" value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="검색할 동아리 이름" />
          <button type="submit">검색하기</button>
        </form>

        <div className="search-results">
          {searchResults.map(group => (
            <div key={group.id} className="search-result">
              <div className="search-result-info">
                <h3>{group.name}</h3>
                <p>{group.description}</p>
              </div>
              {/* 참여 버튼 클릭 시 모달 열기 함수 호출 */}
              <button onClick={() => handleOpenModal(group)}>참여</button>
            </div>
          ))}
        </div>
      </div>

      {/* --- 모달 UI --- */}
      {isModalOpen && selectedGroup && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={handleCloseModal}>&times;</button>
            <div className="modal-header">
              <h3>{selectedGroup.name}</h3>
              <p>{selectedGroup.description}</p>
            </div>
            <form onSubmit={handleJoinGroup}>
              <p>입장코드</p>
              <div className="password-inputs">
                {joinPassword.map((digit, index) => (
                  <input
                    key={index}
                    type="password"
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