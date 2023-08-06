import { Membership } from "@prisma/client";
import { MembershipDTO } from "./button";

export default function convertToMembershipDTO(
  membership: Membership
): MembershipDTO {
  return {
    id: membership.id,
    title: membership.title,
    amount: membership.amount.toString(),
    active: membership.active,
  };
}
