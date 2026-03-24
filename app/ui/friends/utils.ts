import { FriendshipUiStatus } from "@/app/lib/types/types.friends";

export const friendText = (status: FriendshipUiStatus): string => {
  switch (status) {
    case "friendly":
      return "";
    case "none":
      return "Не друзья";
    case "awaiting_confirm":
      return "На рассмотрении";
    case "pending":
      return "Вас пригласили в друзья";
    case "declined":
      return "Вашу заявку отклонили";
    case "youDecline":
      return "Вы отклонили заявку";
  }
};
