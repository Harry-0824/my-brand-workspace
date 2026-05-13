import styled from "styled-components";

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

const Field = styled.div`
  display: grid;
  gap: 0.25rem;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.75rem;
  font-weight: 700;
`;

const Select = styled.select`
  padding: 0.7rem 0.9rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.textPrimary};
  background: rgb(255 255 255 / 0.02);
  font-size: 0.9rem;
`;
