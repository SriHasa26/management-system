import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { GraduationCap, Users, Shield, ArrowRight } from 'lucide-react';

export const RoleSelectPage: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      <div>
        <Badge variant="forest" size="sm" className="mb-2 uppercase tracking-widest font-bold">
          Portal Gateway
        </Badge>
        <h2 className="text-3xl font-serif font-bold text-[#173F35]">
          Welcome to SRI SAI
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Select your portal to access personalized academic dashboards and resources.
        </p>
      </div>

      <div className="space-y-4">
        {/* Student Card */}
        <Link to="/login/student" className="block group">
          <Card
            variant="paper"
            hoverEffect
            className="p-5 border-[#EDE6D8] border-l-4 border-l-[#2E6B57] group-hover:border-[#2E6B57] transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F0F5F3] text-[#2E6B57] flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-serif font-bold text-[#173F35]">Student Portal</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Access notes, assignments, mock tests, results & timetable
                </p>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-[#F7F3EA] text-[#173F35] group-hover:bg-[#173F35] group-hover:text-white transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Card>
        </Link>

        {/* Parent Card */}
        <Link to="/login/parent" className="block group">
          <Card
            variant="paper"
            hoverEffect
            className="p-5 border-[#EDE6D8] border-l-4 border-l-[#B85C45] group-hover:border-[#B85C45] transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF2F0] text-[#B85C45] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-serif font-bold text-[#173F35]">Parent Portal</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Track attendance, test marks, fee receipts & educator updates
                </p>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-[#F7F3EA] text-[#173F35] group-hover:bg-[#B85C45] group-hover:text-white transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Card>
        </Link>

        {/* Admin Card */}
        <Link to="/login/admin" className="block group">
          <Card
            variant="paper"
            hoverEffect
            className="p-5 border-[#EDE6D8] border-l-4 border-l-[#C99A3D] group-hover:border-[#C99A3D] transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF6EE] text-[#C99A3D] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-serif font-bold text-[#173F35]">Admin Portal</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Manage batches, tests, attendance, admissions & collections
                </p>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-[#F7F3EA] text-[#173F35] group-hover:bg-[#C99A3D] group-hover:text-[#173F35] transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Card>
        </Link>
      </div>

      <div className="pt-4 text-center">
        <Link to="/" className="text-xs font-semibold text-stone-500 hover:text-[#173F35]">
          ← Back to main homepage
        </Link>
      </div>
    </div>
  );
};
