import { ArrowLeft } from 'lucide-react';

export default function BackButton({ whenClicked, className }) {
  return (
    <button
      onClick={whenClicked}
      className={className}
      aria-label="Go Back"
    >
      <ArrowLeft size={18} />
      <span>Back</span>
    </button>
  );
}