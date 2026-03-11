import { Link } from 'react-router-dom';
import { Avatar } from '@/components/ui';

interface WelcomeHeaderProps {
  displayName: string;
}

export function WelcomeHeader({ displayName }: WelcomeHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <p className="text-stone text-sm">今天也要加油哦</p>
        <h1 className="font-display text-3xl font-bold text-charcoal">
          Hi, {displayName}
        </h1>
      </div>
      <Link to="/profile">
        <Avatar name={displayName} size="lg" color="bg-coral" className="shadow-coral" />
      </Link>
    </div>
  );
}
