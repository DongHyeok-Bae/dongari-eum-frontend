import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import MemberManagement from '../components/MemberManagement';
import AccountingManagement from '../components/AccountingManagement';

const API_URL = process.env.REACT_APP_API_URL;

const PageWrapper = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f7f7f7;
`;

const Sidebar = styled.aside`
  width: 240px;
  background-color: #ffffff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e0e0e0;
  text-align: center;
`;

const ClubLogo = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 10px auto 30px auto;
  object-fit: cover;
  background-color: #e0e0e0;
`;

const NavMenu = styled.nav`
  flex-grow: 1;
`;

const NavItem = styled.a`
  display: block;
  padding: 12px 15px;
  margin-bottom: 8px;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  cursor: pointer;

  &.active {
    background-color: #e9ecef;
    color: #000;
    font-weight: 700;
  }

  &:hover {
    background-color: #f1f3f5;
  }
`;

const BottomMenu = styled.div`
    padding-bottom: 15px;
`;

const UserProfile = styled.div`
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc;
`;

const UserName = styled.span`
  font-weight: bold;
  display: block;
`;

const LogoutButton = styled.button`
  font-size: 0.9rem;
  color: #868e96;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const MainTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
`;

const Placeholder = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e9ecef;
  border-radius: 8px;
  color: #868e96;
  font-size: 1.2rem;
`;

const AddRecordButton = styled.button`
  padding: 10px 20px;
  /* ... AddButton과 유사한 스타일 ... */
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const PostItem = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #eee;
  cursor: pointer;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
`;

const PostTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 10px 0;
`;

const PostMeta = styled.div`
  color: #666;
  font-size: 1rem;
`;

// 날짜 포맷 헬퍼
const formatDate = (dateString) => {
    if (!dateString) return '미정';
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

function ClubMainPage() {
  const [clubInfo, setClubInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('schedule'); // 'schedule', 'members', 'accounting'
  const [operationLogs, setOperationLogs] = useState([]);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const navigate = useNavigate();
  const { clubId } = useParams();

  const fetchOperationLogs = useCallback(async () => {
    if (!clubId) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await axios.get(
        `${API_URL}/clubs/${clubId}/operation-logs`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOperationLogs(response.data);
    } catch (error) {
      console.error("활동 기록 로딩 실패:", error);
    }
  }, [clubId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("로그인이 필요합니다.");
        navigate('/');
        return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [clubResponse, userResponse] = await Promise.all([
          axios.get(`${API_URL}/clubs/${clubId}`),
          axios.get(`${API_URL}/auth/users/me`)
        ]);

        setClubInfo(clubResponse.data);
        setUserInfo(userResponse.data);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        alert("데이터를 불러오는 데 실패했습니다.");
        if (error.response && error.response.status === 401) {
            navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clubId, navigate]);

  useEffect(() => {
    if (activeView === 'schedule') {
      fetchOperationLogs();
    }
  }, [activeView, fetchOperationLogs]);

  if (loading) {
    return <PageWrapper><div>로딩 중...</div></PageWrapper>;
  }

  if (!clubInfo || !userInfo) {
    return <PageWrapper><div>정보를 불러올 수 없습니다.</div></PageWrapper>;
  }
  
  return (
    <PageWrapper>
      <Sidebar>
        <ClubLogo 
          src={clubInfo.image_url ? `${API_URL}/${clubInfo.image_url}` : "https://via.placeholder.com/80"} 
          alt={`${clubInfo.name} logo`} 
        />
        <NavMenu>
          <NavItem 
            className={activeView === 'schedule' ? 'active' : ''}
            onClick={() => setActiveView('schedule')}
          >
            일정표 (달력)
          </NavItem>
          <NavItem 
            className={activeView === 'members' ? 'active' : ''}
            onClick={() => setActiveView('members')}
          >
            부원 관리
          </NavItem>
          <NavItem 
            className={activeView === 'accounting' ? 'active' : ''}
            onClick={() => setActiveView('accounting')}
          >
            회계 관리
          </NavItem>
        </NavMenu>
        <BottomMenu>
            <NavItem>(설정)</NavItem>
            <NavItem onClick={() => navigate('/main')}>동아리 생성/참여</NavItem>
        </BottomMenu>
        <UserProfile>
          <UserAvatar />
          <div>
            <UserName>{userInfo.last_name}{userInfo.first_name}</UserName>
            <LogoutButton>로그아웃</LogoutButton>
          </div>
        </UserProfile>
      </Sidebar>
      <MainContent>
        {activeView === 'schedule' && (
            <>
                <Header>
                  <MainTitle>{clubInfo.name} 활동 일지</MainTitle>
                  <AddRecordButton onClick={() => navigate(`/club/${clubId}/operation-logs/new`)}>
                    추가하기
                  </AddRecordButton>
                </Header>
                <PostList>
                    {operationLogs.length > 0 ? (
                        operationLogs.map(log => (
                            <PostItem key={log.id} onClick={() => navigate(`/club/${clubId}/operation-logs/${log.id}`)}>
                                <PostTitle>{log.title}</PostTitle>
                                <PostMeta>
                                    📅 {formatDate(log.start_date)} ~ {formatDate(log.end_date)}
                                    {log.team && ` | 👥 ${log.team}`}
                                </PostMeta>
                            </PostItem>
                        ))
                    ) : (
                        <Placeholder>작성된 기록이 없습니다.</Placeholder>
                    )}
                </PostList>
            </>
        )}
        {activeView === 'members' && <MemberManagement clubId={clubInfo.id} />}
        {activeView === 'accounting' && <AccountingManagement clubId={clubInfo.id} />}
      </MainContent>
    </PageWrapper>
  );
}

export default ClubMainPage; 