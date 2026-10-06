import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/site';
import { locationConfig } from '../../config/location';
import { GraduationCap, MapPin, Phone, Mail, Clock, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-[#173F35] text-[#F7F3EA] pt-16 pb-12 border-t-4 border-[#C99A3D] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#2E6B57]/50">
          {/* Col 1: Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2E6B57] flex items-center justify-center text-[#C99A3D] border border-[#C99A3D]/40">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-serif font-black tracking-tight text-white block">
                  {siteConfig.name}
                </span>
                <span className="text-xs uppercase tracking-widest text-[#C99A3D] block font-semibold">
                  {siteConfig.subtitle}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              Dedicated to building intellectual curiosity, academic rigor, and personal confidence for students from foundational schooling to intermediate board mastery.
            </p>

            <div className="p-3.5 rounded-xl bg-[#0E2822]/80 border border-[#2E6B57]/40 text-xs text-stone-300">
              <span className="text-[#C99A3D] font-bold block mb-1">Our Guiding Promise</span>
              "Learn Better. Grow Stronger. Achieve More."
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C99A3D]">Quick Links</h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/programs" className="hover:text-white transition-colors">Academic Programs</Link>
              </li>
              <li>
                <Link to="/admissions" className="hover:text-white transition-colors">Admissions & Enquiries</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Centre & Contact</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C99A3D]">Portals</h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <Link to="/login/student" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>Student Portal</span>
                  <ArrowUpRight className="w-3 h-3 text-[#C99A3D]" />
                </Link>
              </li>
              <li>
                <Link to="/login/parent" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>Parent Portal</span>
                  <ArrowUpRight className="w-3 h-3 text-[#C99A3D]" />
                </Link>
              </li>
              <li>
                <Link to="/login/admin" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>Admin Operations</span>
                  <ShieldCheck className="w-3 h-3 text-[#C99A3D]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Centre Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C99A3D]">Centre Contact</h4>
            <div className="space-y-2 text-xs text-stone-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C99A3D] shrink-0 mt-0.5" />
                <span className="leading-snug">{locationConfig.address.line1}, {locationConfig.address.line2}, {locationConfig.address.city}, {locationConfig.address.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C99A3D] shrink-0" />
                <span>{locationConfig.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C99A3D] shrink-0" />
                <span>{locationConfig.contact.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C99A3D] shrink-0 mt-0.5" />
                <span className="leading-snug">{locationConfig.workingHours.weekdays}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright and disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} SRI SAI Tuition & Learning Centre. All rights reserved.</p>
          <p className="text-[11px] text-stone-400 max-w-xl text-center md:text-right">
            {siteConfig.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
};
