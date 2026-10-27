/**
 * Model Layer: UserModel representation and sanitization
 */
export function createUserModel(raw) {
  return {
    id: raw.id,
    name: raw.name || "Unknown Name",
    username: raw.username || "anonymous",
    email: raw.email || "no-email@campus.edu",
    phone: raw.phone || "N/A",
    website: raw.website || "N/A",
    company: raw.company?.name || raw.company || "Independent",
    city: raw.address?.city || raw.city || "Campus Central"
  };
}
