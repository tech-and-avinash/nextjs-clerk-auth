// types.ts

export type Attachment = {
  file_name: string;
  url: string;
  content_type: string;
};

export type Note = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_firstname: string | null;

  isPinned: boolean;
  isArchived: boolean;
  isChecklist: boolean;

  checklist_items?: ChecklistItem[];
  reminders?: { time: string }[];
  attachments?: Attachment[];
};
export type CreateChecklistItem = {
  text: string;
  isChecked: boolean;
};

// Used when receiving checklist items from backend (includes id & timestamps)
export type ChecklistItem = CreateChecklistItem & {
  id: string;
  created_at: string;
  updated_at: string;
};