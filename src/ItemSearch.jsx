import React, { useState, useEffect } from 'react';
import item from './items.json';

const ItemSearch = () => {
    const [itemsData] = useState(item);
    const [search, setSearch] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [containerWidth, setContainerWidth] = useState('50vw');

    // 👉 반응형 처리 로직
    useEffect(() => {
        const checkWidth = () => {
            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            setContainerWidth(isMobile ? '100vw' : '40vw');
        };

        checkWidth(); // 초기 실행
        window.addEventListener('resize', checkWidth); // 창 크기 변경 시

        return () => window.removeEventListener('resize', checkWidth);
    }, []);

    useEffect(() => {
        const trimmed = search.trim();

        if (trimmed === '') {
            setFilteredItems([]);
            return;
        }

        const isEnglish = (text) => /^[a-zA-Z]+$/.test(text);

        if ((isEnglish(trimmed) && trimmed.length < 3) || (!isEnglish(trimmed) && trimmed.length < 2)) {
            setFilteredItems([]);
            return;
        }

        const filtered = Object.entries(itemsData).filter(([code, names]) => {
            const kmsName = names.KMS || '';
            const gmsName = names.GMS || '';
            const lowerSearch = trimmed.toLowerCase();

            return (
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
        <div
            style={{
                padding: 20,
                width: containerWidth,
                height: "100vh",
                margin: 'auto',
                boxSizing: 'border-box'
            }}
        >
            <input
                type="text"
                autoFocus
                placeholder="이름 검색 (한글/영어 모두 가능, 한글 최소 2글자, 영어 최소 3글자)"
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
                <>
                    <p style={{ marginBottom: 10 }}>
                        총 {filteredItems.length.toLocaleString()}개 결과
                    </p>
                    <div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ borderBottom: '1px solid #ccc' }}>
                                <th style={{ textAlign: 'left', padding: 8, width: "20%" }}>아이템 코드</th>
                                <th style={{ textAlign: 'left', padding: 8, width: "40%" }}>KMS 이름</th>
                                <th style={{ textAlign: 'left', padding: 8, width: "40%" }}>GMS 이름</th>
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
                    </div>
                </>
            ) : (
                search && (() => {
                    const trimmed = search.trim();
                    const isEnglish = /^[a-zA-Z]+$/.test(trimmed);

                    if ((isEnglish && trimmed.length < 3) || (!isEnglish && trimmed.length < 2)) {
                        return (
                            <p>
                                검색어가 너무 짧습니다. {isEnglish ? '영어는 최소 3글자 이상 입력해주세요.' : '한글 및 기타는 최소 2글자 이상 입력해주세요.'}
                            </p>
                        );
                    } else {
                        return <p>검색 결과가 없습니다.</p>;
                    }
                })()
            )}
        </div>
    );
};

export default ItemSearch;
