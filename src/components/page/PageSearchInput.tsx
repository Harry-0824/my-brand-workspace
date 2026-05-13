import styled from "styled-components";

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

const Field = styled.div`
  display: grid;
  gap: 0.25rem;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.75rem;
  font-weight: 700;
`;

const Input = styled.input`
  padding: 0.7rem 0.9rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.textPrimary};
  background: rgb(255 255 255 / 0.02);
  font-size: 0.9rem;
`;
