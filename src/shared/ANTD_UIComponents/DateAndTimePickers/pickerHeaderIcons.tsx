import { ChevronLeft, ChevronRight } from "lucide-react";

const iconProps = { size: 16, strokeWidth: 1.75 } as const;

export const pickerHeaderPrevIcon = <ChevronLeft {...iconProps} />;
export const pickerHeaderNextIcon = <ChevronRight {...iconProps} />;
