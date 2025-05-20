import { ArrowLeft } from 'lucide-react';

export default function BackButton({ whenClicked }) {
  return (
    <button
      onClick={whenClicked}
      className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-800 text-white hover:bg-neutral-700 transition-colors max-w-fit"
      aria-label="Go Back"
    >
      <ArrowLeft size={18} />
      <span>Back</span>
    </button>
  );
}