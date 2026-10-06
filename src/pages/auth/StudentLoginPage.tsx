import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { GraduationCap, Lock, ArrowRight, UserCheck, KeyRound } from 'lucide-react';

export const StudentLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsStudent } = useAuth();
  const { success, error } = useToast();

  const [studentId, setStudentId] = useState('SRI-2026-001');
  const [password, setPassword] = useState('pass123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) {
      error('Student ID Required', 'Please enter your SRI-2026 student roll number or email.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      loginAsStudent(studentId);
      setIsLoading(false);
      success('Welcome back, Rahul!', 'Logged in to Student Dashboard');
      navigate('/student');
    }, 600);
  };

  const handleQuickDemoFill = (id: string, name: string) => {
    setStudentId(id);
    setPassword('demo2026');
    success('Quick Demo Selected', `Autofilled credentials for ${name} (${id})`);
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="forest" size="sm" className="font-bold gap-1">
            <GraduationCap className="w-3.5 h-3.5" /> Student Login
          </Badge>
          <Link to="/login" className="text-xs text-stone-500 hover:text-[#173F35]">
            Switch Role
          </Link>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#173F35]">
          Student Portal Access
        </h2>
        <p className="text-xs text-stone-600 mt-1">
          Your learning journey, study materials, and tests all in one place.
        </p>
      </div>

      <Card variant="paper" className="p-6 sm:p-8 border-[#EDE6D8] shadow-elevated">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Student ID or Registered Email"
            placeholder="e.g. SRI-2026-001"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            helperText="Default Demo ID: SRI-2026-001 (Rahul Sharma)"
          />

          <Input
            label="Access Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={<Lock className="w-4 h-4" />}
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-stone-700">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#E6DDCF] text-[#173F35] focus:ring-[#173F35]"
              />
              <span>Remember this device</span>
            </label>

            <button
              type="button"
              onClick={() => success('Password Reset Note', 'Please contact the centre office to reset your portal password.')}
              className="font-semibold text-[#B85C45] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Enter Student Portal
            </Button>
          </div>
        </form>

        {/* Quick Demo Fill Shortcut */}
        <div className="pt-5 mt-5 border-t border-[#EDE6D8] text-xs">
          <p className="text-stone-500 font-semibold mb-2 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-[#2E6B57]" /> Quick Phase 1 Demo Accounts:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoFill('SRI-2026-001', 'Rahul Sharma')}
              className="px-2.5 py-1 rounded-lg bg-[#F0F5F3] text-[#173F35] font-semibold hover:bg-[#DCE7E3] transition-colors border border-[#8FB1A5]/40 text-[11px]"
            >
              Rahul (Class 10 CBSE)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('SRI-2026-002', 'Ananya Reddy')}
              className="px-2.5 py-1 rounded-lg bg-[#FAF6EE] text-[#A67B2A] font-semibold hover:bg-[#F3EAD7] transition-colors border border-[#E6D3AC] text-[11px]"
            >
              Ananya (Class 10 CBSE)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('SRI-2026-006', 'Sai Vignesh')}
              className="px-2.5 py-1 rounded-lg bg-[#FAF2F0] text-[#B85C45] font-semibold hover:bg-[#F5E2DC] transition-colors border border-[#E8C1B7] text-[11px]"
            >
              Sai (Inter 2nd Year)
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
