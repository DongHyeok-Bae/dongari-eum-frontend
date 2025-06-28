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

const ExportButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  background-color: #6c757d;
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
  flex-grow: 1;
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

const AddForm = styled.tfoot`
  background-color: #f9f9f9;
  
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
  }
`;

const AddButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: var(--main-blue);
  color: white;
  border-radius: 6px;
`;

const PhotoModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
`;

const PhotoModalContent = styled.div`
  max-width: 90vw;
  max-height: 90vh;
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

function AccountingManagement({ clubId }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEntry, setNewEntry] = useState({ date: '', manager: '', description: '', amount: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [viewingPhotoUrl, setViewingPhotoUrl] = useState('');
  const [editId, setEditId] = useState(null);
  const [editEntry, setEditEntry] = useState({ date: '', manager: '', description: '', amount: '' });

  const fetchEntries = useCallback(async () => {
    if (!clubId) return;
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/clubs/${clubId}/accounting/`);
      
      let runningTotal = 0;
      const processedEntries = response.data.map(entry => {
          runningTotal += entry.amount;
          return { ...entry, running_total: runningTotal };
      });

      setEntries(processedEntries);
    } catch (error) {
      console.error("회계 내역 로딩 실패:", error);
      alert("회계 내역을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEntry.date || !newEntry.description || !newEntry.amount) {
        alert("날짜, 내역, 금액은 필수 항목입니다.");
        return;
    }

    const formData = new FormData();
    formData.append('date', newEntry.date);
    formData.append('description', newEntry.description);
    formData.append('amount', newEntry.amount);
    if (newEntry.manager) formData.append('manager', newEntry.manager);
    if (photoFile) formData.append('photo', photoFile);

    try {
        await axios.post(`${API_URL}/clubs/${clubId}/accounting/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        fetchEntries(); // 목록 새로고침
        setNewEntry({ date: '', manager: '', description: '', amount: '' }); // 폼 초기화
        setPhotoFile(null);
        if (document.querySelector('input[type="file"]')) {
            document.querySelector('input[type="file"]').value = '';
        }
    } catch (error) {
        console.error("회계 내역 추가 실패:", error);
        alert("회계 내역 추가에 실패했습니다.");
    }
  };

  const openPhotoModal = (url) => {
    setViewingPhotoUrl(url);
    setIsPhotoModalOpen(true);
  };

  const closePhotoModal = () => setIsPhotoModalOpen(false);

  const handleExport = async () => {
    if (!clubId) return;
    if (entries.length === 0) {
      alert("내보낼 회계 내역이 없습니다.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/clubs/${clubId}/accounting?export=true`, {
        responseType: 'blob', // 바이너리 데이터(파일)를 받기 위해 필수!
      });

      // 서버에서 전달된 파일 이름 사용 시도, 없으면 기본값 사용
      const contentDisposition = response.headers['content-disposition'];
      let filename = '회계내역.xlsx';
      if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+?)"/);
          if (filenameMatch.length > 1) {
              filename = decodeURIComponent(filenameMatch[1]);
          }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("엑셀 파일 내보내기 실패:", error);
      alert("엑셀 파일을 내보내는 데 실패했습니다.");
    }
  };

  const handleDelete = async (entryId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`${API_URL}/clubs/${clubId}/accounting/${entryId}`);
      setEntries(entries.filter(e => e.id !== entryId));
    } catch (error) {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleEditClick = (entry) => {
    setEditId(entry.id);
    setEditEntry({
      date: entry.date,
      manager: entry.manager || '',
      description: entry.description,
      amount: entry.amount
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditEntry(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (entryId) => {
    try {
      await axios.patch(`${API_URL}/clubs/${clubId}/accounting/${entryId}`, editEntry);
      setEditId(null);
      fetchEntries();
    } catch (error) {
      alert('수정에 실패했습니다.');
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <Wrapper>
      <Header>
        <MainTitle>회계 관리</MainTitle>
        <ExportButton onClick={handleExport}>내보내기</ExportButton>
      </Header>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>날짜</th>
              <th>담당자</th>
              <th>내역</th>
              <th>금액</th>
              <th>총액</th>
              <th>사진</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {entries.length > 0 ? (
              entries.map((entry) => (
                <tr key={entry.id}>
                  {editId === entry.id ? (
                    <>
                      <td><input type="date" name="date" value={editEntry.date} onChange={handleEditChange} /></td>
                      <td><input type="text" name="manager" value={editEntry.manager} onChange={handleEditChange} /></td>
                      <td><input type="text" name="description" value={editEntry.description} onChange={handleEditChange} /></td>
                      <td><input type="number" name="amount" value={editEntry.amount} onChange={handleEditChange} /></td>
                      <td>{entry.running_total.toLocaleString()}</td>
                      <td>
                        {entry.photo_url && (
                          <button onClick={() => openPhotoModal(`${API_URL}/${entry.photo_url}`)}>
                            보기
                          </button>
                        )}
                      </td>
                      <td>
                        <button onClick={() => handleEditSave(entry.id)}>저장</button>
                        <button onClick={handleEditCancel}>취소</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{entry.date}</td>
                      <td>{entry.manager}</td>
                      <td>{entry.description}</td>
                      <td>{entry.amount.toLocaleString()}</td>
                      <td>{entry.running_total.toLocaleString()}</td>
                      <td>
                        {entry.photo_url && (
                          <button onClick={() => openPhotoModal(`${API_URL}/${entry.photo_url}`)}>
                            보기
                          </button>
                        )}
                      </td>
                      <td>
                        <button onClick={() => handleEditClick(entry)}>수정</button>
                        <button onClick={() => handleDelete(entry.id)}>삭제</button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '50px' }}>
                  등록된 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
          <AddForm>
            <tr>
              <td><input type="date" name="date" value={newEntry.date} onChange={handleInputChange} /></td>
              <td><input type="text" name="manager" placeholder="담당자" value={newEntry.manager} onChange={handleInputChange} /></td>
              <td><input type="text" name="description" placeholder="내역" value={newEntry.description} onChange={handleInputChange} /></td>
              <td><input type="number" name="amount" placeholder="금액" value={newEntry.amount} onChange={handleInputChange} /></td>
              <td>{/* 총액 계산 결과 */}</td>
              <td><input type="file" name="photo" onChange={handleFileChange} /></td>
            </tr>
            <tr>
              <td colSpan="7">
                <AddButton onClick={handleSubmit}>내역 추가</AddButton>
              </td>
            </tr>
          </AddForm>
        </Table>
      </TableWrapper>
      
      {isPhotoModalOpen && (
        <PhotoModalOverlay onClick={closePhotoModal}>
            <PhotoModalContent>
                <img src={viewingPhotoUrl} alt="영수증 사진" />
            </PhotoModalContent>
        </PhotoModalOverlay>
      )}
    </Wrapper>
  );
}

export default AccountingManagement; 