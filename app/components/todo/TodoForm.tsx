'use client';

import React, { useState } from 'react';
import { Paperclip, ListChecks, StickyNote } from 'lucide-react';
import { CreateChecklistItem } from '../../types/types'; // ✅ Use the shared type if defined there

type Props = {
  title: string;
  description: string;
  setTitle: (val: string) => void;
  setDescription: (val: string) => void;
  checklistItems: CreateChecklistItem[];
  setChecklistItems: (items: CreateChecklistItem[]) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  onSubmit: () => void;
};

const TodoForm = ({
  title,
  description,
  setTitle,
  setDescription,
  checklistItems,
  setChecklistItems,
  file,
  setFile,
  onSubmit,
}: Props) => {
  const [showDescription, setShowDescription] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showAttachment, setShowAttachment] = useState(false);

  const handleChecklistChange = <K extends keyof CreateChecklistItem>(
    index: number,
    field: K,
    value: CreateChecklistItem[K]
  ) => {
    const updated = [...checklistItems];
    updated[index][field] = value;
    setChecklistItems(updated);
  };

  const addChecklistItem = () => {
    setChecklistItems([...checklistItems, { text: '', isChecked: false }]);
  };

  const removeChecklistItem = (index: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== index));
  };

  return (
    <div className="grid col-1 mb-6 gap-4">
      {/* Title + Icons */}
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />
        <div className="absolute right-2 flex gap-2">
          <button type="button" onClick={() => setShowDescription((prev) => !prev)}>
            <StickyNote className="w-5 h-5 text-gray-600 hover:text-blue-500" />
          </button>
          <button type="button" onClick={() => setShowChecklist((prev) => !prev)}>
            <ListChecks className="w-5 h-5 text-gray-600 hover:text-blue-500" />
          </button>
          <button type="button" onClick={() => setShowAttachment((prev) => !prev)}>
            <Paperclip className="w-5 h-5 text-gray-600 hover:text-blue-500" />
          </button>
        </div>
      </div>

      {/* Description */}
      {showDescription && (
        <textarea
          rows={4}
          placeholder="Write a new note..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />
      )}

      {/* Checklist */}
      {showChecklist && (
        <div className="space-y-2">
          <p className="font-medium">Checklist</p>

          {checklistItems.length > 0 &&
            checklistItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.isChecked}
                  onChange={(e) => handleChecklistChange(index, 'isChecked', e.target.checked)}
                />
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleChecklistChange(index, 'text', e.target.value)}
                  placeholder="Checklist item"
                  className="flex-1 px-2 py-1 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeChecklistItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}

          <button
            type="button"
            onClick={addChecklistItem}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add checklist item
          </button>
        </div>
      )}

      {/* File Upload */}
      {showAttachment && (
        <div>
          <label className="block font-medium mb-1">Attachment (image/pdf/video)</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept="image/*,application/pdf,video/*"
          />
        </div>
      )}

      <button
        onClick={onSubmit}
        className="w-24 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Add
      </button>
    </div>
  );
};

export default TodoForm;
