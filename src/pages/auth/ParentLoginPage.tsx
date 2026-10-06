import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Users, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export const ParentLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsParent } = useAuth();
  const { success } = useToast();

  const [identifier, setIdentifier] = useState('+91 98480 12345');
  const [password, setPassword] = useState('parent2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      loginAsParent(identifier);
      setIsLoading(false);
      success('Welcome, Mrs. Sunita Sharma!', 'Logged in to Parent Dashboard');
      navigate('/parent');
    }, 600);
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="terracotta" size="sm" className="font-bold gap-1">
            <Users className="w-3.5 h-3.5" /> Parent Portal
          </Badge>
          <Link to="/login" className="text-xs text-stone-500 hover:text-[#173F35]">
            Switch Role
          </Link>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#173F35]">
          Parent & Guardian Login
        </h2>
        <p className="text-xs text-stone-600 mt-1">
          Stay connected with your child's learning journey and academic milestones.
        </p>
      </div>

      <Card variant="paper" className="p-6 sm:p-8 border-[#EDE6D8] shadow-elevated">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Registered Mobile Number or Email"
            placeholder="+91 98480 12345"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            helperText="Demo Parent Phone: +91 98480 12345 (Mrs. Sunita Sharma)"
          />

          <Input
            label="Parent Access PIN / Password"
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
                className="rounded border-[#E6DDCF] text-[#B85C45] focus:ring-[#B85C45]"
              />
              <span>Keep me signed in</span>
            </label>

            <button
              type="button"
              onClick={() => success('OTP Verification', 'Mock OTP 8492 sent to your registered mobile.')}
              className="font-semibold text-[#B85C45] hover:underline"
            >
              Login via Mobile OTP
            </button>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Access Parent Dashboard
            </Button>
          </div>
        </form>

        <div className="pt-5 mt-5 border-t border-[#EDE6D8] flex items-center justify-between text-[11px] text-stone-500">
          <span className="flex items-center gap-1 text-[#2E6B57]">
            <ShieldCheck className="w-3.5 h-3.5" /> Multi-Child Guardian Account
          </span>
          <span className="font-mono">Demo Auto-Linked</span>
        </div>
      </Card>
    </div>
  );
};
