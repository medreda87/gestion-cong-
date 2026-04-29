// src/components/ui/alert.jsx
export function Alert({ children }) {
  return (
    <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
      {children}
    </div>
  );
}

export function AlertDescription({ children }) {
  return <p className="text-sm">{children}</p>;
}