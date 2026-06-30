export function FormField({ label, ...props }) {
  return (
    <label>
      <span className="label">{label}</span>
      <input className="input" {...props} />
    </label>
  );
}

export function SelectField({ label, children, ...props }) {
  return (
    <label>
      <span className="label">{label}</span>
      <select className="input" {...props}>{children}</select>
    </label>
  );
}
