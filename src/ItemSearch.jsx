import React, { useState, useEffect } from 'react';
import item from './items.json';

const ItemSearch = () => {
    const [itemsData] = useState(item);
    const [search, setSearch] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);

    useEffect(() => {
        const trimmed = search.trim();

        // 검색어 없으면 결과 초기화 (빈 배열)
        if (trimmed === '') {
            setFilteredItems([]);
            return;
        }

        // 한글 여부 확인 함수
        const isKorean = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);
        const isEnglish = (text) => /^[a-zA-Z]+$/.test(text);

        // 검색어 길이 체크
        if ((isEnglish(trimmed) && trimmed.length < 3) || (isKorean(trimmed) && trimmed.length < 2)) {
            setFilteredItems([]);
            return;
        }

        // 필터링
        const filtered = Object.entries(itemsData).filter(([code, names]) => {
            const codeStr = code.toString();
            const kmsName = names.KMS || '';
            const gmsName = names.GMS || '';

            const lowerSearch = trimmed.toLowerCase();

            return (
                codeStr.includes(lowerSearch) ||
                kmsName.toLowerCase().includes(lowerSearch) ||
                gmsName.toLowerCase().includes(lowerSearch)
            );
        }).map(([code, names]) => ({
            code,
            KMS: names.KMS,
            GMS: names.GMS,
        }));

        setFilteredItems(filtered);
    }, [search, itemsData]);

    return (
        <div style={{ padding: 20, width: 1000, height: "100vh", margin: 'auto' }}>
            <input
                type="text"
                placeholder="아이템 코드 또는 이름 검색 (한글/영어 모두 가능, 한글 최소 2글자, 영어 최소 3글자)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: 16,
                    marginBottom: 20,
                    boxSizing: 'border-box',
                }}
            />

            {filteredItems.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ borderBottom: '1px solid #ccc' }}>
                        <th style={{ textAlign: 'left', padding: 8, width: 100 }}>아이템 코드</th>
                        <th style={{ textAlign: 'left', padding: 8, width: 200 }}>KMS 이름</th>
                        <th style={{ textAlign: 'left', padding: 8, width: 200 }}>GMS 이름</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredItems.map(({ code, KMS, GMS }) => (
                        <tr key={code} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: 8, verticalAlign: 'top' }}>
                                <a
                                    href={`https://meaegi.com/analysis/coordi/item/${code}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#06c', textDecoration: 'underline' }}
                                >
                                    {code}
                                </a>
                            </td>
                            <td style={{ padding: 8, verticalAlign: 'top' }}>{KMS || '-'}</td>
                            <td style={{ padding: 8, verticalAlign: 'top' }}>{GMS || '-'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                search && <p>검색 결과가 없습니다.</p>
            )}
        </div>
    );
};

export default ItemSearch;
