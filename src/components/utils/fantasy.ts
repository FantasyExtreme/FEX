import { Auth } from "@/types/store";
import { toast } from "react-toastify";

export function isConnected(auth: Auth): boolean {
  return auth.state == 'initialized';
}
export function requireAuth(auth: Auth): boolean {
  if (isConnected(auth)) {
    return true;
  } else {
    toast.error(
      'Please Connect with Internet Identity to perform this action',
      { autoClose: 3000 },
    );
    return false;
  }
}
