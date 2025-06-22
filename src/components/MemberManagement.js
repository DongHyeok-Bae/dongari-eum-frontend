import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const Wrapper = styled.div`
  width: 100%;
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

const AddButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  background-color: var(--main-blue);
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
`;

const TableWrapper = styled.div`
  width: 100%;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  
  th, td {
    padding: 15px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  th {
    font-weight: 600;
    color: var(--text-secondary);
  }
  
  tbody tr:last-child td {
    border-bottom: none;
  }
`;

// 모달 스타일 추가
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
`;

const ModalForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const ModalActions = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  background-color: var(--main-blue);
  color: white;
`;

const CancelButton = styled(SaveButton)`
  background-color: #6c757d;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--main-blue);
  margin-left: 10px;
  font-size: 0.9rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

function MemberManagement({ clubId }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingMember, setEditingMember] = useState(null);

  const fetchMembers = useCallback(async () => {
    if (!clubId) return;
    try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/clubs/${clubId}/members/`);
        setMembers(response.data);
    } catch (error) {
        console.error("부원 목록 로딩 실패:", error);
        alert("부원 목록을 불러오는 데 실패했습니다.");
    } finally {
        setLoading(false);
    }
  }, [clubId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
        alert("이름은 필수 항목입니다.");
        return;
    }

    const url = editingMember
      ? `${API_URL}/clubs/${clubId}/members/${editingMember.id}`
      : `${API_URL}/clubs/${clubId}/members/`;
    
    const method = editingMember ? 'patch' : 'post';

    try {
        await axios[method](url, formData);
        setIsModalOpen(false);
        fetchMembers();
    } catch (error) {
        const action = editingMember ? "수정" : "추가";
        alert(`부원 ${action}에 실패했습니다.`);
    }
  };
  
  const openModal = (member = null) => {
    if (member) {
        setEditingMember(member);
        setFormData(member);
    } else {
        setEditingMember(null);
        setFormData({
            name: '', birth_date: '', student_id: '', major: '', 
            phone_number: '', email: '', member_year: '', role: '부원', memo: ''
        });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (memberId) => {
    if (window.confirm("정말로 이 부원을 삭제하시겠습니까?")) {
        try {
            await axios.delete(`${API_URL}/clubs/${clubId}/members/${memberId}`);
            fetchMembers();
        } catch (error) {
            alert("부원 삭제에 실패했습니다.");
        }
    }
  };

  if (loading && members.length === 0) return <div>로딩 중...</div>;

  return (
    <Wrapper>
      <Header>
        <MainTitle>부원 관리</MainTitle>
        <AddButton onClick={() => openModal()}>추가하기</AddButton>
      </Header>
      
      {isModalOpen && (
        <ModalOverlay>
            <ModalContent>
                <h2>{editingMember ? "부원 정보 수정" : "새 부원 추가"}</h2>
                <ModalForm onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>이름*</Label>
                        <Input name="name" value={formData.name} onChange={handleInputChange} required/>
                    </FormGroup>
                    <FormGroup>
                        <Label>생년월일</Label>
                        <Input name="birth_date" placeholder="YYYY-MM-DD" value={formData.birth_date} onChange={handleInputChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label>학번</Label>
                        <Input name="student_id" value={formData.student_id} onChange={handleInputChange} />
                    </FormGroup>
                     <FormGroup>
                        <Label>학과</Label>
                        <Input name="major" value={formData.major} onChange={handleInputChange} />
                    </FormGroup>
                     <FormGroup>
                        <Label>연락처</Label>
                        <Input name="phone_number" value={formData.phone_number} onChange={handleInputChange} />
                    </FormGroup>
                     <FormGroup>
                        <Label>이메일</Label>
                        <Input type="email" name="email" value={formData.email} onChange={handleInputChange} />
                    </FormGroup>
                     <FormGroup>
                        <Label>기수</Label>
                        <Input type="number" name="member_year" value={formData.member_year} onChange={handleInputChange} />
                    </FormGroup>
                     <FormGroup>
                        <Label>직책</Label>
                        <Input name="role" value={formData.role} onChange={handleInputChange} />
                    </FormGroup>
                    <FormGroup style={{ gridColumn: '1 / -1' }}>
                        <Label>메모</Label>
                        <Input name="memo" value={formData.memo} onChange={handleInputChange} />
                    </FormGroup>
                    <ModalActions>
                        <CancelButton type="button" onClick={() => setIsModalOpen(false)}>취소</CancelButton>
                        <SaveButton type="submit">저장</SaveButton>
                    </ModalActions>
                </ModalForm>
            </ModalContent>
        </ModalOverlay>
      )}

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>이름</th>
              <th>생년월일</th>
              <th>학번</th>
              <th>학과</th>
              <th>연락처</th>
              <th>이메일</th>
              <th>기수</th>
              <th>직책</th>
              <th>메모</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? (
              members.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.birth_date}</td>
                  <td>{member.student_id}</td>
                  <td>{member.major}</td>
                  <td>{member.phone_number}</td>
                  <td>{member.email}</td>
                  <td>{member.member_year}</td>
                  <td>{member.role}</td>
                  <td>{member.memo}</td>
                  <td>
                    <ActionButton onClick={() => openModal(member)}>수정</ActionButton>
                    <ActionButton onClick={() => handleDelete(member.id)}>삭제</ActionButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '50px' }}>
                  등록된 부원이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableWrapper>
    </Wrapper>
  );
}

export default MemberManagement; 