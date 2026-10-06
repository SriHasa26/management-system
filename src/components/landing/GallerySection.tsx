import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { mockGalleryItems } from '../../data/mockTimetable';
import { Badge } from '../common/Badge';

export const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Classroom', 'Learning', 'Events', 'Activities', 'Celebrations'];

  const filteredItems = selectedCategory === 'All'
    ? mockGalleryItems
    : mockGalleryItems.filter((item) => item.category === selectedCategory);

  return (
    <section id="gallery" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Campus Life & Learning"
          badgeVariant="gold"
          title="Inside SRI SAI Learning Centre"
          subtitle="A vibrant, supportive atmosphere engineered for focused study and joyful academic breakthroughs."
        />

        {/* Categories Tab */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#173F35] text-white shadow-sm'
                  : 'bg-[#F7F3EA] text-stone-600 hover:bg-[#EAE4D5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry / Grid Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-[#FFFDF8] border border-[#EDE6D8] shadow-soft hover:shadow-card transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden bg-stone-200">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="forest" size="sm">
                    {item.category}
                  </Badge>
                  <span className="text-[11px] text-stone-400 font-mono">{item.date}</span>
                </div>
                <h4 className="text-base font-serif font-bold text-[#173F35] mb-1">{item.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
