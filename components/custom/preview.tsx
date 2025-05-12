"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.bubble.css";

interface PreviewProps {
  value: string;
  onChange?: (value: string) => void; // Make optional
}

export const Preview = ({ value, onChange }: PreviewProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );

  return (
    <div className="bg-white">
      <ReactQuill value={value} onChange={onChange || (() => {})} theme="bubble" />
    </div>
  );
};
