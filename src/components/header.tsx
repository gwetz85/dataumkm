import { Database } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto flex items-center gap-3 h-16 px-4 md:px-8">
        <div className="bg-primary p-2 rounded-lg">
          <Database className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-headline font-bold text-primary">
          WiraData
        </h1>
      </div>
    </header>
  );
}
