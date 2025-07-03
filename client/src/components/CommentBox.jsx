import React, { useState } from 'react';

export default function CommentBox({ comments = [], onSubmit, onEdit, onDelete, userId }) {
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (onSubmit) onSubmit(text.trim());
    setText('');
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingText.trim()) return;
    if (onEdit) onEdit(editingId, editingText.trim());
    setEditingId(null);
    setEditingText('');
  };

  return (
    <div className="border p-3 bg-gray-50 rounded flex flex-col min-h-[185px]">
      <h3 className="font-semibold mb-1">Comments:</h3>
      <div className="flex-1 max-h-24 overflow-y-auto space-y-1 text-sm mb-2">
        {comments.map((c) => (
          <div key={c._id} className="leading-snug flex gap-2">
            {editingId === c._id ? (
              <>
                <input
                  className="border p-1 flex-1 rounded text-sm"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button
                  onClick={handleEditSubmit}
                  className="text-xs bg-green-500 text-white px-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => { setEditingId(null); setEditingText(''); }}
                  className="text-xs bg-gray-300 px-1 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">
                  <span className="font-medium">{c.username}</span>: {c.text}
                </span>
                {userId === c.userId && (
                  <>
                    <button
                      onClick={() => { setEditingId(c._id); setEditingText(c.text); }}
                      className="text-xs text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(c._id)}
                      className="text-xs text-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 pt-1 mt-auto">
        <input
          className="border p-1 flex-1 rounded"
          placeholder="Add a comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white px-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}