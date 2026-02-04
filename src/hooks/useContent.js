import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const useContent = (collectionName) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const q = query(collection(db, collectionName));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const docs = [];
            querySnapshot.forEach((doc) => {
                docs.push({ id: doc.id, ...doc.data() });
            });
            setData(docs);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching content:", err);
            // Fallback to empty array if Firebase isn't configured yet
            setError("Firebase not configured or permission denied. Using local state.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [collectionName]);

    const addItem = async (item) => {
        try {
            await addDoc(collection(db, collectionName), item);
        } catch (err) {
            console.error("Error adding item:", err);
        }
    };

    const deleteItem = async (id) => {
        try {
            await deleteDoc(doc(db, collectionName, id));
        } catch (err) {
            console.error("Error deleting item:", err);
        }
    };

    const updateItem = async (id, updates) => {
        try {
            await updateDoc(doc(db, collectionName, id), updates);
        } catch (err) {
            console.error("Error updating item:", err);
        }
    };

    return { data, loading, error, addItem, deleteItem, updateItem };
};
