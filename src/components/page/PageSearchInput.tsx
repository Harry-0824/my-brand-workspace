import { Field, Input, Label } from "./PageSearchInput.styles";

type PageSearchInputProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

export function PageSearchInput({
  id,
  label,
  value,
  placeholder,
  onChange
}: PageSearchInputProps) {
  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  );
}
