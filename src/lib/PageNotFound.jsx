import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground mb-8">Page not found</p>
      <Link to="/" className="text-primary underline">Go home</Link>
    </div>
  );
}
