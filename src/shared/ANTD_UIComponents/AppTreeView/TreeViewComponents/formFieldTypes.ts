export interface FormField<T extends Record<string, any>> {
    name: keyof T;
    label: string;
    tooltip: string;
    placeholder: string;
    type: "text" | "textarea";
    textAreaProps?: { rows: number };
    maxLength?: number;
}

