import { Field, Label, Select } from "./PageFilterControl.styles";

export const ALL_FILTER_VALUE = "__ALL__";

type PageFilterControlProps = {
  id: string;
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  allLabel?: string;
};

export function PageFilterControl({
  id,
  label,
  options,
  value,
  onChange,
  allLabel = "全部"
}: PageFilterControlProps) {
  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>
      <Select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value={ALL_FILTER_VALUE}>{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </Field>
  );
}
