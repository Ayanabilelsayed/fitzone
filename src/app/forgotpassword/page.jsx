
import { Suspense } from "react";
import ResetPassword from "./forgotpassword";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<p className="p-6 text-center text-white">Loading...</p>}>
      <ResetPassword />
    </Suspense>
  );
}
