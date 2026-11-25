'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firestore';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';

export function useFirestoreDocument<T = DocumentData>(
  collectionName: string,
  docId: string | null
) {
  const [state, setState] = useState<{
    key: string | null;
    data: T | null;
    error: Error | null;
  }>({
    key: null,
    data: null,
    error: null,
  });

  const activeKey = docId ? `${collectionName}:${docId}` : null;

  useEffect(() => {
    if (!docId || !activeKey || !db) return;

    const docRef = doc(db, collectionName, docId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        setState({
          key: activeKey,
          data: snapshot.exists() ? (snapshot.data() as T) : null,
          error: null,
        });
      },
      (err) => {
        console.error('Firestore subscription error:', err);
        setState({
          key: activeKey,
          data: null,
          error: err,
        });
      }
    );

    return () => unsubscribe();
  }, [collectionName, docId, activeKey]);

  const loading = Boolean(activeKey && db && state.key !== activeKey);
  const data = activeKey && db && state.key === activeKey ? state.data : null;
  const error = activeKey && db && state.key === activeKey ? state.error : null;

  return { data, loading, error };
}
