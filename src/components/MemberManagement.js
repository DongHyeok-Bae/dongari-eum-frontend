import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

// Styled-components for styling the component
const Container = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const Title = styled.h2`
  color: #333;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1 1 calc(33.333% - 30px);
  min-width: 150px;
`;

// 성별 선택을 위한 Select 스타일 추가
const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1 1 calc(33.333% - 30px);
  min-width: 150px;
  background-color: white;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  background-color: #f2f2f2;
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
`;

const ActionButton = styled.button`
  padding: 5px 10px;
  margin-right: 5px;
  border: none;
  border-radius: 3px;
  cursor: pointer;

  &.edit {
    background-color: #ffc107;
  }
  &.delete {
    background-color: #dc3545;
    color: white;
  }
  &.save {
    background-color: #28a745;
    color: white;
  }
`;

const API_URL = process.env.REACT_APP_API_URL;

const MemberManagement = ({ clubId }) => {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: "",
    department: "",
    student_id: "",
    phone_number: "",
    birth: "",
    email: "",
    position: "",
    gender: "", // 성별 상태 추가
  });
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});

  const fetchMembers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${API_URL}/clubs/${clubId}/members`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMembers(response.data);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [clubId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${API_URL}/clubs/${clubId}/members`,
        newMember,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewMember({
        name: "",
        department: "",
        student_id: "",
        phone_number: "",
        birth: "",
        email: "",
        position: "",
        gender: "",
      });
      fetchMembers();
    } catch (error) {
      console.error("Failed to add member:", error);
    }
  };

  const handleDeleteMember = async (memberId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `${API_URL}/clubs/${clubId}/members/${memberId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMembers();
    } catch (error) {
      console.error("Failed to delete member:", error);
    }
  };

  const handleEdit = (member) => {
    setEditingId(member.id);
    setEditingData(member);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingData({ ...editingData, [name]: value });
  };

  const handleSave = async (memberId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${API_URL}/clubs/${clubId}/members/${memberId}`,
        editingData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditingId(null);
      fetchMembers();
    } catch (error) {
      console.error("Failed to save member:", error);
    }
  };

  return (
    <Container>
      <Title>부원 관리</Title>
      <Form onSubmit={handleAddMember}>
        <Input name="name" placeholder="이름" value={newMember.name} onChange={handleInputChange} />
        <Input name="department" placeholder="학과" value={newMember.department} onChange={handleInputChange} />
        <Input name="student_id" placeholder="학번" value={newMember.student_id} onChange={handleInputChange} />
        <Input name="phone_number" placeholder="연락처" value={newMember.phone_number} onChange={handleInputChange} />
        <Input name="birth" placeholder="생년월일" value={newMember.birth} onChange={handleInputChange} />
        <Input name="email" placeholder="이메일" value={newMember.email} onChange={handleInputChange} />
        <Input name="position" placeholder="직책" value={newMember.position} onChange={handleInputChange} />
        <Select name="gender" value={newMember.gender} onChange={handleInputChange}>
          <option value="">성별 선택</option>
          <option value="남">남</option>
          <option value="여">여</option>
        </Select>
        <Button type="submit">부원 추가</Button>
      </Form>
      <Table>
        <thead>
          <tr>
            <Th>이름</Th>
            <Th>학과</Th>
            <Th>학번</Th>
            <Th>연락처</Th>
            <Th>생년월일</Th>
            <Th>이메일</Th>
            <Th>직책</Th>
            <Th>성별</Th>
            <Th>관리</Th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              {editingId === member.id ? (
                <>
                  <Td><Input name="name" value={editingData.name} onChange={handleEditChange} /></Td>
                  <Td><Input name="department" value={editingData.department} onChange={handleEditChange} /></Td>
                  <Td><Input name="student_id" value={editingData.student_id} onChange={handleEditChange} /></Td>
                  <Td><Input name="phone_number" value={editingData.phone_number} onChange={handleEditChange} /></Td>
                  <Td><Input name="birth" value={editingData.birth} onChange={handleEditChange} /></Td>
                  <Td><Input name="email" value={editingData.email} onChange={handleEditChange} /></Td>
                  <Td><Input name="position" value={editingData.position} onChange={handleEditChange} /></Td>
                  <Td>
                    <Select name="gender" value={editingData.gender} onChange={handleEditChange}>
                        <option value="">선택</option>
                        <option value="남">남</option>
                        <option value="여">여</option>
                    </Select>
                  </Td>
                  <Td>
                    <ActionButton className="save" onClick={() => handleSave(member.id)}>저장</ActionButton>
                  </Td>
                </>
              ) : (
                <>
                  <Td>{member.name}</Td>
                  <Td>{member.department}</Td>
                  <Td>{member.student_id}</Td>
                  <Td>{member.phone_number}</Td>
                  <Td>{member.birth}</Td>
                  <Td>{member.email}</Td>
                  <Td>{member.position}</Td>
                  <Td>{member.gender}</Td>
                  <Td>
                    <ActionButton className="edit" onClick={() => handleEdit(member)}>수정</ActionButton>
                    <ActionButton className="delete" onClick={() => handleDeleteMember(member.id)}>삭제</ActionButton>
                  </Td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default MemberManagement;