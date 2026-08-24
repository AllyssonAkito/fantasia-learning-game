import { avatarCatalog } from '@fantasia/domain';

export interface AvatarPickerProps {
  value: string;
  onChange: (avatarId: string) => void;
}

export function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  return (
    <fieldset className="avatar-picker">
      <legend>Escolha um personagem</legend>
      <div className="avatar-picker__grid">
        {avatarCatalog.map((avatar) => (
          <label className="avatar-option" key={avatar.id}>
            <input
              checked={value === avatar.id}
              name="avatar"
              onChange={() => onChange(avatar.id)}
              type="radio"
              value={avatar.id}
            />
            <span
              aria-hidden="true"
              className="avatar-option__symbol"
              style={{ backgroundColor: avatar.color }}
            >
              {avatar.symbol}
            </span>
            <span>{avatar.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
