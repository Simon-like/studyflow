import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-cream flex">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
