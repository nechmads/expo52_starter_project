/**
 * Slices a full name into first and last name components.
 * @param name The full name to slice.
 * @returns An object containing the first and last name.
 */
export function sliceName(name: string): { firstName: string; lastName: string } {
  const trimmedName = name.trim();

  if (!trimmedName) {
    // Case 0: Empty string
    return { firstName: "", lastName: "" };
  }

  const nameParts = trimmedName.split(/\s+/);

  if (nameParts.length === 1) {
    // Case 1: Just a first name
    return { firstName: nameParts[0], lastName: "" };
  } else if (nameParts.length === 2) {
    // Case 2: First and last name
    return { firstName: nameParts[0], lastName: nameParts[1] };
  } else {
    // Case 3: First, middle, and last name (or more parts)
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");
    return { firstName, lastName };
  }
}

export const truncatestringForDisplay = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};
