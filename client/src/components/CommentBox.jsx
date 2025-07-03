// Comment list and entry form component
import React, { useState } from "react";

export default function CommentBox({
  comments = [],
  onSubmit,
  onEdit,
  onDelete,
  userId,
}) {
  // New comment text
  const [text, setText] = useState("");
  // Track which comment is being edited
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  // Which comment's menu is open
  const [openMenuId, setOpenMenuId] = useState(null);

  // Submit a new comment
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (onSubmit) onSubmit(text.trim());
    setText("");
  };

  // Save edits to an existing comment
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingText.trim()) return;
    if (onEdit) onEdit(editingId, editingText.trim());
    setEditingId(null);
    setEditingText("");
  };

  // Render comment list and editor
  return (
    <div className="border p-3 bg-gray-600 rounded flex flex-col min-h-[185px]">
      <h3 className="font-semibold mb-1">Comments:</h3>
      <div className="flex-1 max-h-24 overflow-y-auto space-y-1 text-sm mb-2">
        {comments.map((c) => (
          <div key={c._id} className="leading-snug flex gap-2 relative">
            {editingId === c._id ? (
              <>
                <input
                  className="border p-1 flex-1 rounded text-sm bg-white text-gray-900"
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
                  onClick={() => {
                    setEditingId(null);
                    setEditingText("");
                  }}
                  className="text-xs bg-gray-300 px-1 rounded text-gray-600"
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
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === c._id ? null : c._id)
                      }
                      className="px-2 text-black-500 hover:text-black-700"
                    >
                      &#8942;
                    </button>
                    {openMenuId === c._id && (
                      <div className="absolute right-0 mt-1 bg-white border rounded shadow z-10 p-1 flex flex-col">
                        <button
                          onClick={() => {
                            setEditingId(c._id);
                            setEditingText(c.text);
                            setOpenMenuId(null);
                          }}
                          className="text-xs px-2 py-1 rounded border hover:bg-gray-100 text-left text-gray-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            onDelete && onDelete(c._id);
                            setOpenMenuId(null);
                          }}
                          className="text-xs px-2 py-1 rounded border mt-1 hover:bg-gray-100 text-left text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 pt-1 mt-auto">
        <input
          className="border p-1 flex-1 rounded text-gray-900"
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
