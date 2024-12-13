import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Container } from '../layout/Container';

interface ProfileTab {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

const PROFILE_TABS: ProfileTab[] = [
  { label: 'Overview', path: '/profile' },
  { label: 'Account', path: '/profile/account' },
  { label: 'Personal Info', path: '/profile/personal' },
  { label: 'Care Plans', path: '/profile/care-plans' }
];

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const location = useLocation();

  return (
    <Container className="py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64">
          <Card>
            <nav className="space-y-1">
              {PROFILE_TABS.map(tab => (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`
                    block px-4 py-2 rounded-lg transition-colors
                    ${location.pathname === tab.path
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          </Card>
        </aside>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </Container>
  );
}