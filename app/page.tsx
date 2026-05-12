import { BaleReader } from "@/components/BaleReader";

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          تست بله - HamAI
        </h1>
        <BaleReader />
      </div>
    </div>
  );
}