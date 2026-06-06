export default function UserNotRegisteredError() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background text-foreground">
      <h2 className="text-2xl font-bold mb-2">Account Not Found</h2>
      <p className="text-muted-foreground">Your account is not registered. Please contact support.</p>
    </div>
  );
}
