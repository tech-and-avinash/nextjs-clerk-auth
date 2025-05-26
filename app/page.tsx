'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth, useUser, RedirectToSignIn } from '@clerk/nextjs';
import { ChecklistItem, CreateChecklistItem, Note } from './types/types';
import TodoForm from './components/todo/TodoForm';
import TodoList from './components/todo/TodoList';
import ConfirmModal from './components/ConfirmModal';
import  {Header}  from './components/Header';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [checklistItems, setChecklistItems] = useState<CreateChecklistItem[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const { getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!user) return;

    const userData = {
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      imageUrl: user.imageUrl || '',
    };

    axios.post(`${API_URL}/users`, userData).catch((error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        console.log('User already exists.');
      } else {
        console.error('Error creating user:', error);
      }
    });
  }, [user]);

  const getNotes = async () => {
    const token = await getToken();
    if (!token) return;

    try {
      const res = await axios.get(`${API_URL}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedNotes = Array.isArray(res.data?.notes) ? res.data.notes : [];
      setNotes(fetchedNotes);
    } catch (error: any) {
      console.error('Error fetching notes:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (isSignedIn) getNotes();
  }, [isSignedIn]);

  const handleSubmit = async () => {
    const token = await getToken();
    if (!token) return;

    let attachment = null;

    // Upload file if selected
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await axios.post(`${API_URL}/files/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const { fileName, url, contentType } = uploadRes.data;
      attachment = { fileName, url, contentType };
    }

    // ✅ Filter out empty checklist items
    const filteredChecklistItems = checklistItems.filter(item => item.text.trim() !== '');

    try {
      const res = await axios.post(
        `${API_URL}/notes`,
        {
          title,
          description,
          isChecklist: filteredChecklistItems.length > 0,
          checklistItems: filteredChecklistItems,
          reminders: [],
          attachments: attachment ? [attachment] : [],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotes((prev) => [...prev, res.data]);

      // ✅ Reset all form fields
      setTitle('');
      setDescription('');
      setChecklistItems([]); // ✅ No empty item after reset
      setFile(null);
    } catch (error: any) {
      console.error('Error adding note:', error.response?.data || error.message);
    }
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;

    try {
      const token = await getToken();
      await axios.delete(`${API_URL}/notes/${noteToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((n) => n.id !== noteToDelete.id));
      setNoteToDelete(null);
    } catch (error: any) {
      console.error('Error deleting note:', error.response?.data || error.message);
    }
  };

  const handleDelete = (note: Note) => {
    setNoteToDelete(note);
    setIsConfirmOpen(true);
  };

  if (!isLoaded) return null;
  if (!isSignedIn) return <RedirectToSignIn />;

  return (
    <div className="flex justify-center items-start min-h-screen bg-white">
      <div className="w-1/2 py-10 px-4">
        <Header />

        <TodoForm
          title={title}
          description={description}
          setTitle={setTitle}
          setDescription={setDescription}
          checklistItems={checklistItems}
          setChecklistItems={setChecklistItems} 
          file={file}
          setFile={setFile}
          onSubmit={handleSubmit}
        />

        <TodoList
          notes={notes}
          onSelect={setSelectedNote}
          onDelete={handleDelete}
        />

        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Note"
          message={`Are you sure you want to delete "${noteToDelete?.title}"?`}
        />
      </div>
    </div>
  );
}

