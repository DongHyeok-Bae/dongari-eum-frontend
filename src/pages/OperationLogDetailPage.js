import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Wrapper = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 0 0 10px 0;
`;

const MetaInfo = styled.div`
  color: #666;
  font-size: 1rem;
`;

const ContentSection = styled.div`
  margin-top: 20px;
`;

const ContentItem = styled.div`
  margin-bottom: 25px;

  h3 {
    font-size: 1.2rem;
    color: #333;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 8px;
    margin-bottom: 10px;
  }

  p, a {
    font-size: 1rem;
    line-height: 1.6;
    color: #555;
    white-space: pre-wrap; /* 줄바꿈 및 공백 유지 */
  }
`;

const formatDate = (dateString) => {
    if (!dateString) return '미정';
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

// content 객체의 key를 한글 레이블로 변환
const contentLabels = {
  meetingName: '회의명',
  location: '장소',
  attendees: '참석자',
  agenda: '주요 안건',
  details: '회의 내용',
  recorder: '회의록 작성자',
  eventName: '행사/프로젝트명',
  eventDate: '일시',
  intentionAndGoals: '기획 의도 및 목표',
  mainContentsAndProgram: '주요 내용 및 프로그램',
  participants: '참여 대상',
  estimatedCost: '예상 비용',
  author: '작성자',
  numberOfParticipants: '참가 인원',
  mainProgressDetails: '주요 진행 내용',
  resultsAndAchievements: '결과 및 성과',
  totalExecutionCost: '총 집행 비용',
  feedback: '피드백',
  memo: '메모',
  freeContent: '내용',
  file_url: '첨부 파일'
};

function OperationLogDetailPage() {
  const { clubId, logId } = useParams();
  const [log, setLog] = useState(null);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const response = await axios.get(`${API_URL}/clubs/${clubId}/operation-logs/${logId}`);
        setLog(response.data);
      } catch (error) {
        console.error("활동 기록 로딩 실패:", error);
        alert("활동 기록을 불러오는 데 실패했습니다.");
        navigate(`/club/${clubId}`);
      }
    };
    fetchLog();
  }, [clubId, logId, navigate]);

  const renderContent = () => {
    if (!log.content) return null;
    return Object.entries(log.content).map(([key, value]) => {
      const label = contentLabels[key] || key;
      
      if (key === 'file_url') {
          return (
            <ContentItem key={key}>
                <h3>{label}</h3>
                <a href={`${API_URL}${value}`} target="_blank" rel="noopener noreferrer">
                    {value.split('/').pop()}
                </a>
            </ContentItem>
          )
      }

      return (
        <ContentItem key={key}>
          <h3>{label}</h3>
          <p>{value}</p>
        </ContentItem>
      );
    });
  };

  if (!log) {
    return <div>로딩 중...</div>;
  }

  return (
    <Wrapper>
      <BackButton onClick={() => navigate(-1)}>← 목록으로</BackButton>
      <Header>
        <Title>{log.title}</Title>
        <MetaInfo>
          📅 {formatDate(log.start_date)} ~ {formatDate(log.end_date)}
          {log.team && ` | 👥 ${log.team}`}
        </MetaInfo>
      </Header>
      <ContentSection>
        {renderContent()}

        {log.files && log.files.length > 0 && (
            <ContentItem>
                <h3>첨부 파일</h3>
                {log.files.map(file => (
                    <p key={file.id}>
                        <a href={`${API_URL}/${file.file_path}`} target="_blank" rel="noopener noreferrer">
                            {file.file_name}
                        </a>
                    </p>
                ))}
            </ContentItem>
        )}
      </ContentSection>
    </Wrapper>
  );
}

export default OperationLogDetailPage; 