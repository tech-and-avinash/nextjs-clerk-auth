'use client';

import React from 'react';
import { Note } from '../../types/types';
import { Trash2 } from 'lucide-react';

type Props = {
  notes: Note[];
  onSelect: (note: Note) => void;
  onDelete: (note: Note) => void; // Triggers modal in parent
};

const getSpanClass = (descriptionLength: number) => {
  if (descriptionLength > 300) return 'col-span-3 row-span-2';
  if (descriptionLength > 150) return 'col-span-1 row-span-2';
  return '';
};

const TodoList = ({ notes, onSelect, onDelete }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(100px,_auto)]">
      {notes.map((note) => {
        const spanClass = getSpanClass(note.description.length ?? 0);

        return (
          <div
            key={note.id}
            className={`relative p-4 bg-gray-100 rounded-xl shadow-md border cursor-pointer hover:bg-gray-200 transition ${spanClass}`}
          >
            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent note selection
                onDelete(note);      // Trigger modal
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition"
              title="Delete note"
            >
              <Trash2 size={18} />
            </button>

            {/* Note content */}
            <div onClick={() => onSelect(note)}>
              <p className="font-semibold text-lg mb-1">{note.title}</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap mb-2">
                {note.description}
              </p>

              {/* Checklist */}
              {note.isChecklist && Array.isArray(note.checklist_items) && note.checklist_items.length > 0 && (
                <ul className="mb-2 text-sm text-gray-800 list-disc pl-5">
                  {note.checklist_items.map((item) => (
                    <li key={item.id} className="flex items-center gap-2">
                      <input type="checkbox" checked={item.isChecked} readOnly />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Attachments */}
              {Array.isArray(note.attachments) && note.attachments.length > 0 && (
                <div className="mt-2 text-xs text-blue-600">
                  {note.attachments.map((file, index) => (
                    <a
                      key={index}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate hover:underline"
                    >
                      📎 {file.file_name}
                    </a>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                Created by: {note.user_firstname ?? 'Unknown'} <br />
                at: {new Date(note.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TodoList;
