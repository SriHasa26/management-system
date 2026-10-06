import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Shield, Lock, ArrowRight, ShieldAlert } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsAdmin } = useAuth();
  const { success } = useToast();

  const [email, setEmail] = useState('dhanalakshmi.telu@srisaituition.edu.in');
  const [password, setPassword] = useState('admin2026');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      loginAsAdmin(email);
      setIsLoading(false);
      success('Administrator Authenticated', 'Entering Administrative Command Center');
      navigate('/admin');
    }, 600);
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="gold" size="sm" className="font-bold gap-1 text-[#173F35]">
            <Shield className="w-3.5 h-3.5" /> Operations Gateway
          </Badge>
          <Link to="/login" className="text-xs text-stone-500 hover:text-[#173F35]">
            Switch Role
          </Link>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#173F35]">
          Centre Administration
        </h2>
        <p className="text-xs text-stone-600 mt-1">
          Manage SRI SAI with clarity, speed, and confidence.
        </p>
      </div>

      <Card variant="paper" className="p-6 sm:p-8 border-[#EDE6D8] shadow-elevated bg-gradient-to-b from-[#FFFDF8] to-[#FDFBF7]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Staff / Administrator Email"
            placeholder="dhanalakshmi.telu@srisaituition.edu.in"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            helperText="Admin: Mrs. Telu Dhana Lakshmi"
          />

          <Input
            label="Admin Security Key"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={<Lock className="w-4 h-4" />}
          />

          <div className="p-3 rounded-xl bg-[#FAF6EE] border border-[#E6D3AC] flex items-center gap-2 text-xs text-[#7F5C1B]">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Restricted area. Authorised administrative personnel only.</span>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-[#173F35] hover:bg-[#235746]"
              isLoading={isLoading}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Admin Center
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
