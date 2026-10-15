import type { ClientFormValues } from "../schemas/clientFormSchema";
import type { TCreateClientRequest } from "../types/client";

const emptyToNull = (value: string) => {
  const text = value.trim();
  return text ? text : null;
};

export const emptyClientFormValues = (): ClientFormValues => ({
  name: "",
  notes: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "",
  contactPerson: "",
  taxNumber: "",
});

export const formValuesToCreateBody = (
  values: ClientFormValues,
): TCreateClientRequest => ({
  name: emptyToNull(values.name),
  notes: emptyToNull(values.notes),
  email: emptyToNull(values.email),
  phone: emptyToNull(values.phone),
  address: emptyToNull(values.address),
  city: emptyToNull(values.city),
  country: emptyToNull(values.country),
  contactPerson: emptyToNull(values.contactPerson),
  taxNumber: emptyToNull(values.taxNumber),
});
