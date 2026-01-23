import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook
import EnterEmail from "../components/PasswordReset/EnterEmail";
import OTPVerify from "../components/PasswordReset/OTPVerify";
import SetNewPassword from "../components/PasswordReset/SetNewPassword";

export default function ForgetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate(); // ✅ Initialize navigation

  return (
    <div>
      {step === 1 && (
        <EnterEmail
          onNext={(email) => {
            setEmail(email);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <OTPVerify
          email={email}
          onNext={(otp) => {
            setOtp(otp);
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <SetNewPassword
          email={email}
          otp={otp}
          onSuccess={() => {
            setStep(4);
            // ✅ Redirect to login after short delay
            setTimeout(() => {
              navigate("/");
            }, 2000);
          }}
        />
      )}

    
    </div>
  );
}
