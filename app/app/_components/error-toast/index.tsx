"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export function ErrorToast() {
  const searchParams = useSearchParams();

  const hasToastShownRef = useRef<boolean>(false);

  const err = searchParams.get("error");

  useEffect(() => {
    if (err) {
      if (!hasToastShownRef.current) {
        hasToastShownRef.current = true;

        toast.error(err);
      }
    }
  }, [err]);

  return null;
}
