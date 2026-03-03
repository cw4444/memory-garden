import React, { useState, useRef } from 'react';
import { Camera, Plus, Heart, Share2, Calendar, Video } from 'lucide-react';

const PLACEHOLDER_THUMBNAILS = {
  acorn: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23a8d5a3"/><circle cx="150" cy="120" r="40" fill="%238fbc8f"/><ellipse cx="150" cy="180" rx="20" ry="30" fill="%23654321"/><text x="150" y="250" text-anchor="middle" fill="%232d5016" font-size="20">🌰</text></svg>`,
  rain: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23b6d7ff"/><path d="M50 50 Q100 80 150 50 T250 50" stroke="%236bb6ff" stroke-width="3" fill="none"/><circle cx="80" cy="100" r="2" fill="%234a90e2"/><circle cx="120" cy="150" r="2" fill="%234a90e2"/><circle cx="200" cy="120" r="2" fill="%234a90e2"/><text x="150" y="250" text-anchor="middle" fill="%232c5aa0" font-size="18">☔</text></svg>`,
  new: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23ffd1dc"/><circle cx="150" cy="150" r="80" fill="%23ffb6c1"/><text x="150" y="160" text-anchor="middle" fill="%23d63384" font-size="24">✨</text></svg>`,
};

const INITIAL_MEMORIES = [
  {
    id: 1,
    date: '2025-06-27',
    caption: 'Found the most perfect acorn today! Sometimes the smallest treasures bring the biggest smiles 🌰',
    type: 'image',
    thumbnail: PLACEHOLDER_THUMBNAILS.acorn,
  },
  {
    id: 2,
    date: '2025-06-26',
    caption: 'Rainy day magic - watched droplets race down the window while drinking tea',
    type: 'image',
    thumbnail: PLACEHOLDER_THUMBNAILS.rain,
  },
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function MemoryCard({ memory }) {
  return (
    <div className="group cursor-pointer">
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/40 group-hover:scale-105">
        <div className="aspect-square relative overflow-hidden">
          <img
            src={memory.thumbnail}
            alt="Memory"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {memory.type === 'video' && (
            <div className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
              <Video className="w-4 h-4 text-emerald-600" />
            </div>
          )}
        </div>
        <div className="p-4">
          <span className="text-xs text-emerald-600 font-medium flex items-center space-x-1 mb-2">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(memory.date)}</span>
          </span>
          <p className="text-sm text-gray-700 leading-relaxed">{memory.caption}</p>
        </div>
      </div>
    </div>
  );
}

function TimelineCard({ memory }) {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/40">
      <div className="flex items-start space-x-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
          <img src={memory.thumbnail} alt="Memory" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-emerald-600 font-medium flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(memory.date)}</span>
            </span>
            <button className="text-emerald-500 hover:text-emerald-600 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-700 leading-relaxed">{memory.caption}</p>
        </div>
      </div>
    </div>
  );
}

function AddMemoryModal({ onClose, onSave }) {
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState('image');
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileType(file.type.startsWith('video') ? 'video' : 'image');
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!caption.trim()) return;
    onSave({
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      caption,
      type: fileType,
      thumbnail: preview ?? PLACEHOLDER_THUMBNAILS.new,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/50">
        <h3 className="text-xl font-semibold text-emerald-800 mb-6 text-center">
          Capture Today's Magic ✨
        </h3>

        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3 mb-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 px-4 py-3 bg-emerald-100 hover:bg-emerald-200 rounded-xl text-emerald-700 transition-colors"
            >
              <Camera className="w-5 h-5" />
              <span>Add Photo / Video</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {preview && (
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-emerald-200">
                {fileType === 'video' ? (
                  <video src={preview} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                )}
              </div>
            )}
          </div>

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What made this moment special? ✨"
            className="w-full p-4 border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none bg-white/80 backdrop-blur-sm resize-none h-24 placeholder-emerald-400"
          />

          <div className="flex space-x-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl transition-all duration-200 shadow-lg"
            >
              Save Memory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MemoryGarden() {
  const [memories, setMemories] = useState(INITIAL_MEMORIES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentView, setCurrentView] = useState('grid');

  function handleSaveMemory(memory) {
    setMemories((prev) => [memory, ...prev]);
    setShowAddForm(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50">
      {/* Decorative background dots */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-emerald-300 rounded-full opacity-60 animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-sky-400 rounded-full opacity-40 animate-bounce" />
        <div
          className="absolute bottom-32 left-1/4 w-3 h-3 bg-amber-200 rounded-full opacity-50 animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 bg-white/20 backdrop-blur-sm border-b border-white/30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-emerald-800">Memory Garden</h1>
              <p className="text-sm text-emerald-600">Your daily moments, treasured ✨</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView(currentView === 'grid' ? 'timeline' : 'grid')}
              className="px-4 py-2 bg-white/40 hover:bg-white/60 rounded-full text-emerald-700 text-sm font-medium transition-all duration-200 backdrop-blur-sm border border-white/30"
            >
              {currentView === 'grid' ? '📅 Timeline' : '⊞ Grid'}
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-2 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Memory</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {showAddForm && (
          <AddMemoryModal onClose={() => setShowAddForm(false)} onSave={handleSaveMemory} />
        )}

        {/* Grid view */}
        {currentView === 'grid' && memories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
          </div>
        )}

        {/* Timeline view */}
        {currentView === 'timeline' && memories.length > 0 && (
          <div className="space-y-6">
            {memories.map((memory) => (
              <TimelineCard key={memory.id} memory={memory} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {memories.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-emerald-800 mb-2">Your memory garden awaits</h3>
            <p className="text-emerald-600 mb-6">Start capturing the magic of everyday moments ✨</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-8 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Plant Your First Memory
            </button>
          </div>
        )}
      </div>

      <div className="h-20" />
    </div>
  );
}
