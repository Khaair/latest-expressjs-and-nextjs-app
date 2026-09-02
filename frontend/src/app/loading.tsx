export default function Loading() {
  return (
    <div className="flex min-h-[40vh] flex-1 items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
    </div>
  );
}
