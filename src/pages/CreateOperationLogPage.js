import React, { useState } from 'react';
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
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  margin-right: 20px;
`;

const TitleInput = styled.input`
  width: 100%;
  border: none;
  font-size: 2rem;
  font-weight: bold;
  padding: 10px 0;
  border-bottom: 2px solid #eee;

  &:focus {
    outline: none;
    border-bottom-color: #333;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  color: #555;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 200px;
  resize: vertical;
`;

const SubmitButton = styled.button`
  background-color: #6c63ff;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #5a52d9;
  }
`;

const MetaInfoWrapper = styled.div`
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: center;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  label {
    font-weight: bold;
    color: #333;
    white-space: nowrap;
  }
`;

const DateInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const MeetingMinutesForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div>
        <SectionTitle>회의명</SectionTitle>
        <Input name="meetingName" value={formData.meetingName || ''} onChange={handleChange} placeholder="회의명을 작성하세요." />
      </div>
      <div>
        <SectionTitle>장소</SectionTitle>
        <Input name="location" value={formData.location || ''} onChange={handleChange} placeholder="장소를 작성하세요." />
      </div>
      <div>
        <SectionTitle>참석자</SectionTitle>
        <Input name="attendees" value={formData.attendees || ''} onChange={handleChange} placeholder="참석자를 작성하세요." />
      </div>
      <div>
        <SectionTitle>주요 안건</SectionTitle>
        <Textarea name="agenda" value={formData.agenda || ''} onChange={handleChange} placeholder="주요 안건을 작성하세요." />
      </div>
      <div>
        <SectionTitle>회의 내용</SectionTitle>
        <Textarea name="details" value={formData.details || ''} onChange={handleChange} placeholder="회의 내용을 작성하세요." />
      </div>
      <div>
        <SectionTitle>회의록 작성자</SectionTitle>
        <Input name="recorder" value={formData.recorder || ''} onChange={handleChange} placeholder="회의록 작성자를 작성하세요." />
      </div>
    </>
  );
};

// --- 기획안 폼 ---
const ProposalForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div>
        <SectionTitle>행사/프로젝트명</SectionTitle>
        <Input name="eventName" value={formData.eventName || ''} onChange={handleChange} placeholder="행사 또는 프로젝트명을 입력하세요." />
      </div>
      <div>
        <SectionTitle>일시</SectionTitle>
        <Input name="eventDate" value={formData.eventDate || ''} onChange={handleChange} placeholder="예: 2025년 6월 1일 오후 2시" />
      </div>
      <div>
        <SectionTitle>장소</SectionTitle>
        <Input name="location" value={formData.location || ''} onChange={handleChange} placeholder="진행 장소를 입력하세요." />
      </div>
      <div>
        <SectionTitle>기획 의도 및 목표</SectionTitle>
        <Textarea name="intentionAndGoals" value={formData.intentionAndGoals || ''} onChange={handleChange} placeholder="기획 의도와 목표를 상세히 작성해주세요." />
      </div>
      <div>
        <SectionTitle>주요 내용 및 프로그램</SectionTitle>
        <Textarea name="mainContentsAndProgram" value={formData.mainContentsAndProgram || ''} onChange={handleChange} placeholder="주요 내용과 프로그램을 상세히 작성해주세요." />
      </div>
      <div>
        <SectionTitle>참여 대상</SectionTitle>
        <Input name="participants" value={formData.participants || ''} onChange={handleChange} placeholder="참여 대상을 입력하세요." />
      </div>
      <div>
        <SectionTitle>예상 비용</SectionTitle>
        <Input name="estimatedCost" value={formData.estimatedCost || ''} onChange={handleChange} placeholder="예상 비용을 입력하세요." />
      </div>
      <div>
        <SectionTitle>기획안 작성자</SectionTitle>
        <Input name="author" value={formData.author || ''} onChange={handleChange} placeholder="기획안 작성자를 입력하세요." />
      </div>
    </>
  );
};

// --- 결과 보고서 폼 ---
const ReportForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div>
        <SectionTitle>행사/프로젝트명</SectionTitle>
        <Input name="eventName" value={formData.eventName || ''} onChange={handleChange} placeholder="행사 또는 프로젝트명을 입력하세요." />
      </div>
      <div>
        <SectionTitle>일시</SectionTitle>
        <Input name="eventDate" value={formData.eventDate || ''} onChange={handleChange} placeholder="예: 2025년 6월 1일 오후 2시" />
      </div>
      <div>
        <SectionTitle>장소</SectionTitle>
        <Input name="location" value={formData.location || ''} onChange={handleChange} placeholder="진행 장소를 입력하세요." />
      </div>
      <div>
        <SectionTitle>참가 인원</SectionTitle>
        <Input name="numberOfParticipants" value={formData.numberOfParticipants || ''} onChange={handleChange} placeholder="총 참가 인원 수를 입력하세요." />
      </div>
      <div>
        <SectionTitle>주요 진행 내용</SectionTitle>
        <Textarea name="mainProgressDetails" value={formData.mainProgressDetails || ''} onChange={handleChange} placeholder="주요 진행 내용을 상세히 작성해주세요." />
      </div>
      <div>
        <SectionTitle>결과 및 성과</SectionTitle>
        <Textarea name="resultsAndAchievements" value={formData.resultsAndAchievements || ''} onChange={handleChange} placeholder="결과 및 성과를 상세히 작성해주세요." />
      </div>
      <div>
        <SectionTitle>총 집행 비용</SectionTitle>
        <Input name="totalExecutionCost" value={formData.totalExecutionCost || ''} onChange={handleChange} placeholder="총 집행 비용을 입력하세요." />
      </div>
       <div>
        <SectionTitle>피드백</SectionTitle>
        <Textarea name="feedback" value={formData.feedback || ''} onChange={handleChange} placeholder="활동에 대한 피드백을 작성해주세요." />
      </div>
      <div>
        <SectionTitle>보고서 작성자</SectionTitle>
        <Input name="author" value={formData.author || ''} onChange={handleChange} placeholder="보고서 작성자를 입력하세요." />
      </div>
    </>
  );
};

// --- 단순 일정 등록 폼 ---
const ScheduleForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div>
        <SectionTitle>메모</SectionTitle>
        <Input name="memo" value={formData.memo || ''} onChange={handleChange} placeholder="일정에 대한 간단한 메모를 남겨주세요." />
      </div>
    </>
  );
};

// --- 자유 양식 폼 ---
const FreeForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
        <Textarea name="freeContent" value={formData.freeContent || ''} onChange={handleChange} placeholder="자유롭게 내용을 작성하세요." style={{ minHeight: '600px' }}/>
    </>
  );
};

// --- 파일 업로드 폼 ---
const FileUploadForm = ({ formData, setFormData, setFiles }) => { // setFile -> setFiles
  const handleContentChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files); // 여러 파일 처리
  };

  return (
    <>
      <div>
        <SectionTitle>메모</SectionTitle>
        <Input name="memo" value={formData.memo || ''} onChange={handleContentChange} placeholder="파일에 대한 간단한 메모를 남겨주세요." />
      </div>
      <div>
        <SectionTitle>파일 첨부 (다중 선택 가능)</SectionTitle>
        <Input 
          type="file" 
          multiple
          onChange={handleFileChange} 
          accept=".pdf,.docx"
        />
      </div>
    </>
  );
};


const postTypeLabels = {
  meeting_minutes: '회의록',
  proposal: '기획안',
  report: '결과 보고서',
  schedule: '일정',
  file_upload: '파일 업로드',
  free_form: '자유 양식',
};

function CreateOperationLogPage() {
  const { clubId, postType } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [formData, setFormData] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [team, setTeam] = useState('');
  const [files, setFiles] = useState([]); // file -> files

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('제목을 입력하세요.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/');
        return;
    }
    
    const payload = new FormData();
    const logData = {
      post_type: postType,
      title: title,
      start_date: startDate || null,
      end_date: endDate || null,
      team: team || null,
      content: formData,
    };
    payload.append('log_data', JSON.stringify(logData));

    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            payload.append('files', files[i]);
        }
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/clubs/${clubId}/operation-logs`,
        payload,
        { 
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('기록이 성공적으로 저장되었습니다.');
      navigate(`/club/${clubId}`);
    } catch (error) {
      console.error('기록 저장 실패:', error);
      alert('기록 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };
  
  const renderForm = () => {
    switch (postType) {
      case 'meeting_minutes':
        return <MeetingMinutesForm formData={formData} setFormData={setFormData} />;
      case 'proposal':
        return <ProposalForm formData={formData} setFormData={setFormData} />;
      case 'report':
        return <ReportForm formData={formData} setFormData={setFormData} />;
      case 'schedule':
        return <ScheduleForm formData={formData} setFormData={setFormData} />;
      case 'file_upload':
        return <FileUploadForm formData={formData} setFormData={setFormData} setFiles={setFiles} />;
      case 'free_form':
        return <FreeForm formData={formData} setFormData={setFormData} />;
      default:
        return <p>지원하지 않는 기록 양식입니다.</p>;
    }
  };

  const currentLabel = postTypeLabels[postType] || '새 기록';

  return (
    <Wrapper>
      <Header>
        <BackButton onClick={() => navigate(-1)}>←</BackButton>
        <TitleInput 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`${currentLabel} 제목을 입력하세요.`} 
        />
      </Header>
      
      <MetaInfoWrapper>
        <InfoRow>
          <label htmlFor="date-select">날짜 선택</label>
          <DateInputWrapper>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <span>–</span>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </DateInputWrapper>
        </InfoRow>
        <InfoRow>
          <label htmlFor="team-select">팀 선택</label>
          <Input 
            id="team-select"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            placeholder="팀 이름을 입력하세요."
          />
        </InfoRow>
      </MetaInfoWrapper>

      <Form onSubmit={handleSubmit}>
        <SectionTitle>{currentLabel}</SectionTitle>
        {renderForm()}
        <SubmitButton type="submit">저장하기</SubmitButton>
      </Form>
    </Wrapper>
  );
}

export default CreateOperationLogPage; 