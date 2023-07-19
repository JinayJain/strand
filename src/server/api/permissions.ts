import { type Role } from "@prisma/client";

type Entity = "strand" | "strandStory" | "user";
type Action = "create" | "read" | "update" | "delete";
type Scope = "own" | "any";

type EntityPermission = `${Entity}:${Action}:${Scope}`;

type CustomPermission = "strandStory:read:future";

export type Permission = EntityPermission | CustomPermission;

class PermissionScheme {
  constructor(public permissions: Permission[]) {}

  public extend(scheme: PermissionScheme) {
    this.permissions.push(...scheme.permissions);
    return this;
  }

  public can(permission: Permission) {
    return this.permissions.includes(permission);
  }
}

function scheme(permissions: Permission[]) {
  return new PermissionScheme(permissions);
}

const GUEST_PERMISSIONS = scheme(["strand:read:any", "strandStory:read:any"]);

const USER_PERMISSIONS = scheme([
  "strand:create:own",
  "strand:update:own",
  "strand:delete:own",
  "user:update:own",
]).extend(GUEST_PERMISSIONS);

const ADMIN_PERMISSIONS = scheme([
  "strandStory:create:own",
  "strandStory:read:future",
]).extend(USER_PERMISSIONS);

const ROLE_PERMISSIONS: Record<Role, PermissionScheme> = {
  GUEST: GUEST_PERMISSIONS,
  USER: USER_PERMISSIONS,
  ADMIN: ADMIN_PERMISSIONS,
};

export function hasPermission(
  role: Role | undefined,
  ...permissions: Permission[]
): boolean {
  return permissions.every((permission) =>
    ROLE_PERMISSIONS[role ?? "GUEST"].can(permission)
  );
}
