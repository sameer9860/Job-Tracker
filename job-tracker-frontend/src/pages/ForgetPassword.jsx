import { useState } from "react";
import EnterEmail from "../components/PasswordReset/EnterEmail";
import OTPVerify from "../components/PasswordReset/OTPVerify";
import SetNewPassword from "../components/PasswordReset/SetNewPassword";

export default function ForgetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <div>
      {step === 1 && <EnterEmail onNext={(email) => { setEmail(email); setStep(2); }} />}
      {step === 2 && <OTPVerify email={email} onNext={() => setStep(3)} />}
      {step === 3 && <SetNewPassword email={email} otp={otp} onSuccess={() => setStep(4)} />}
      {step === 4 && <p style={{ textAlign: "center", marginTop: "40px" }}>Password changed successfully! You can now login.</p>}
    </div>
  );
}
