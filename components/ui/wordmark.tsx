import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const WORDMARK_SRC = "/assets/wordmark.png";
const WORDMARK_ALT = "Petty";
const WORDMARK_WIDTH = 2172;
const WORDMARK_HEIGHT = 724;

const wordmarkVariants = cva("w-auto", {
  variants: {
    size: {
      header: "h-6",
      signature: "h-7",
      display: "h-9",
    },
  },
  defaultVariants: {
    size: "header",
  },
});

export type WordmarkProps = VariantProps<typeof wordmarkVariants> & {
  className?: string;
};

function Wordmark({ size, className }: WordmarkProps) {
  return (
    <Image
      alt={WORDMARK_ALT}
      className={cn(wordmarkVariants({ size }), className)}
      height={WORDMARK_HEIGHT}
      src={WORDMARK_SRC}
      width={WORDMARK_WIDTH}
    />
  );
}

export { Wordmark, wordmarkVariants };
