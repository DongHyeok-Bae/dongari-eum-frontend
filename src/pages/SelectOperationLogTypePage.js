import React from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';

const Wrapper = styled.div`
  max-width: 900px;
  margin: 40px auto;
  padding: 40px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  margin-right: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.1);
  }
`;

const CardIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
`;

const CardTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 10px;
`;

const CardDescription = styled.p`
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
`;

const postTypes = [
  { type: 'meeting_minutes', icon: '📝', title: '회의록', description: '회의의 주요 내용을 기록하고 공유합니다.' },
  { type: 'proposal', icon: '💡', title: '기획안', description: '새로운 활동이나 프로젝트를 제안합니다.' },
  { type: 'report', icon: '📊', title: '결과 보고서', description: '활동 결과를 정리하고 평가합니다.' },
  { type: 'schedule', icon: '📅', title: '단순 일정', description: '간단한 일정과 메모를 등록합니다.' },
  { type: 'file_upload', icon: '📎', title: '파일 업로드', description: '관련 파일을 첨부하고 공유합니다.' },
  { type: 'free_form', icon: '✍️', title: '자유 양식', description: '정해진 형식 없이 자유롭게 기록합니다.' },
];

function SelectOperationLogTypePage() {
  const { clubId } = useParams();
  const navigate = useNavigate();

  const handleSelect = (postType) => {
    navigate(`/club/${clubId}/operation-logs/create/${postType}`);
  };

  return (
    <Wrapper>
      <Header>
        <BackButton onClick={() => navigate(-1)}>←</BackButton>
        <Title>어떤 기록을 추가할까요?</Title>
      </Header>
      <Grid>
        {postTypes.map(pt => (
          <Card key={pt.type} onClick={() => handleSelect(pt.type)}>
            <CardIcon>{pt.icon}</CardIcon>
            <CardTitle>{pt.title}</CardTitle>
            <CardDescription>{pt.description}</CardDescription>
          </Card>
        ))}
      </Grid>
    </Wrapper>
  );
}

export default SelectOperationLogTypePage; 