import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <SignIn />
      </div>
    </div>
  );
}