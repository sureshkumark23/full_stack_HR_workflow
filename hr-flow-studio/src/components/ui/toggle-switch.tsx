interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

export const ToggleSwitch = ({ checked, onChange, label }: ToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="toggle-switch"
    data-on={checked}
    aria-label={label}
  >
    <span
      className="toggle-thumb"
      style={{ transform: checked ? 'translateX(22px)' : 'translateX(2px)' }}
    />
  </button>
);
