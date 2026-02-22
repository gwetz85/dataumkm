import { Database } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-20 px-4 md:px-8">
        <div className="flex items-center gap-3">
            <div className="bg-primary p-3 rounded-xl shadow-md">
              <Database className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-headline font-bold text-primary tracking-tighter">
              WiraData
            </h1>
        </div>
        <p className="text-muted-foreground hidden md:block">Entrepreneur Data Management</p>
      </div>
    </header>
  );
}
