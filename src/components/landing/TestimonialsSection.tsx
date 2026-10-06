import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Quote, Star, Info } from 'lucide-react';

const mockTestimonials = [
  {
    quote: "The personalized attention at SRI SAI transformed how my son approaches mathematics. He went from fearing word problems to eagerly solving quadratic equations.",
    author: "Sample Parent Voice (Mrs. Sunita S.)",
    role: "Mother of Class 10 Student",
    grade: "Class 10 CBSE",
    rating: 5,
  },
  {
    quote: "Small batch sizes make a world of difference. The teachers ensure every single doubt is cleared in the classroom itself before advancing to new topics.",
    author: "Sample Parent Voice (Mr. V. K. Reddy)",
    role: "Father of Class 10 Student",
    grade: "Class 10 CBSE",
    rating: 5,
  },
  {
    quote: "The weekly mock tests and previous-year question papers gave me immense confidence during my board exams. The notes are crisp and easy to revise.",
    author: "Sample Student Voice (Rahul S.)",
    role: "Class 10 Student",
    grade: "Scored 92% in Term Test",
    rating: 5,
  }
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[#FFFDF8] border-y border-[#EDE6D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Community Experiences"
          badgeVariant="terracotta"
          title="Voices of Growth & Trust"
          subtitle="Reflecting our deep commitment to learner confidence and family partnerships."
        />

        {/* Mandatory Phase 1 Demo Notice */}
        <div className="mb-8 p-3 rounded-2xl bg-[#F7F3EA] border border-[#EDE6D8] flex items-center justify-center gap-2 text-xs text-stone-500 max-w-xl mx-auto">
          <Info className="w-4 h-4 text-[#B85C45] shrink-0" />
          <span>Illustrated placeholder feedback reflecting typical student & parent experiences.</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {mockTestimonials.map((item, idx) => (
            <Card
              key={idx}
              variant="paper"
              hoverEffect
              className="p-8 border-[#EDE6D8] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-xl bg-[#FAF2F0] text-[#B85C45]">
                    <Quote className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C99A3D] text-[#C99A3D]" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic mb-6">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#EDE6D8]">
                <h5 className="text-sm font-bold text-[#173F35]">{item.author}</h5>
                <p className="text-xs text-[#B85C45] font-semibold">{item.role}</p>
                <Badge variant="neutral" size="sm" className="mt-2 text-[10px]">
                  {item.grade}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
