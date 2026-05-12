export default function Transcript({ user, ai }: { user: string; ai: string }) {
  return (
    <div className="mt-8 text-center">
      <p className="text-green-400">You: {user}</p>
      <p className="text-blue-400 mt-2">AI: {ai}</p>
    </div>
  );
}