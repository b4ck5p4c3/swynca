"use server";

import { getSession } from "@/app/auth";
import { isKeyExists, createKey, getKeyById, deleteKey } from "@/lib/acs";
import { isACSKeyName, isACSUID, isPAN } from "@/lib/validation";
import { ActionGenericError } from "@/types/data";
import { Literal, Record, Static, String, Union } from "runtypes";

const CreateKeyRequest = Record({
  type: Union(Literal("UID"), Literal("PAN")),
  memberId: String,
  name: String,
  key: String,
});

export type CreateKeyRequest = Static<typeof CreateKeyRequest>;
export type CreateKeyResponse = ActionGenericError | { success: true };

const DeleteKeyRequest = Record({
  id: String,
});

export type DeleteKeyRequest = Static<typeof DeleteKeyRequest>;
export type DeleteKeyResponse = ActionGenericError | { success: true };

export async function create(
  request: CreateKeyRequest
): Promise<CreateKeyResponse> {
  const session = await getSession();
  if (request.memberId !== session.user.id) {
    return {
      success: false,
      message: "You can only manage your own keys",
    };
  }

  if (!CreateKeyRequest.validate(request).success) {
    return {
      success: false,
      message: "Incorrect Member data",
    };
  }

  // Check key name
  if (!isACSKeyName(request.name)) {
    return {
      success: false,
      message: "Incorrect key name",
    };
  }

  // Formalize key (lowercase, no spaces)
  const key = request.key.toLowerCase().replaceAll(" ", "");

  // Verify key correctness
  if (request.type === "UID" && !isACSUID(key)) {
    return {
      success: false,
      message: "Incorrect UID",
    };
  }

  if (request.type === "PAN" && !isPAN(key)) {
    return {
      success: false,
      message: "Incorrect PAN",
    };
  }

  // Check if key already exists
  if (await isKeyExists(key)) {
    return {
      success: false,
      message: "Key already exists",
    };
  }

  // Create key
  await createKey({
    key,
    memberId: request.memberId,
    type: request.type,
    name: request.name,
  });

  return {
    success: true,
  };
}

export async function remove(
  request: DeleteKeyRequest
): Promise<DeleteKeyResponse> {
  const session = await getSession();

  if (!DeleteKeyRequest.validate(request).success) {
    return {
      success: false,
      message: "Incorrect Member data",
    };
  }

  const key = await getKeyById(request.id);
  if (!key) {
    return {
      success: false,
      message: "Key not found",
    };
  }

  if (key.memberId !== session.user.id) {
    return {
      success: false,
      message: "You can only manage your own keys",
    };
  }

  await deleteKey(request.id);

  return {
    success: true,
  };
}
