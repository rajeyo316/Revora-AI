export type ClassValue = string | number | boolean | undefined | null | { [key: string]: any } | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  const process = (item: ClassValue) => {
    if (!item) return;
    if (typeof item === 'string' || typeof item === 'number') {
      classes.push(String(item));
    } else if (Array.isArray(item)) {
      item.forEach(process);
    } else if (typeof item === 'object') {
      for (const [key, value] of Object.entries(item)) {
        if (value) classes.push(key);
      }
    }
  };

  inputs.forEach(process);
  return classes.join(' ');
}

