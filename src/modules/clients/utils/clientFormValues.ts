import type { ClientFormValues } from "../schemas/clientFormSchema";
import type {
  TClient,
  TCreateClientRequest,
  TUpdateClientRequest,
} from "../types/client";

const emptyToNull = (value: string) => {
  const text = value.trim();
  return text ? text : null;
};

const nullToEmpty = (value: string | null | undefined) => value ?? "";

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

export const clientToFormValues = (client: TClient): ClientFormValues => ({
  name: nullToEmpty(client.name),
  notes: nullToEmpty(client.notes),
  email: nullToEmpty(client.email),
  phone: nullToEmpty(client.phone),
  address: nullToEmpty(client.address),
  city: nullToEmpty(client.city),
  country: nullToEmpty(client.country),
  contactPerson: nullToEmpty(client.contactPerson),
  taxNumber: nullToEmpty(client.taxNumber),
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

export const formValuesToEditBody = (
  values: ClientFormValues,
  id: number,
): TUpdateClientRequest => ({
  id,
  ...formValuesToCreateBody(values),
});
