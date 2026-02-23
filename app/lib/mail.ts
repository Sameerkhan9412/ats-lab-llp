// lib/mail.ts
import nodemailer from "nodemailer";

export async function sendOtpMail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  await transporter.sendMail({
    from: `"ATAS Laboratories LLP" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email | ATAS Laboratories LLP",
    html: `
      <div style="
        font-family: Arial, Helvetica, sans-serif;
        background-color: #f4f6fb;
        padding: 40px 20px;
      ">
        <div style="
          max-width: 520px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          overflow: hidden;
        ">

          <!-- Header -->
          <div style="
            background: linear-gradient(135deg, #06b6d4, #2563eb);
            padding: 24px;
            text-align: center;
          ">
            <h1 style="
              color: #ffffff;
              font-size: 22px;
              margin: 0;
              letter-spacing: 0.5px;
            ">
              ATAS Laboratories LLP
            </h1>
            <p style="
              color: #e0f2fe;
              font-size: 13px;
              margin-top: 6px;
            ">
              Trusted Laboratory Platform
            </p>
          </div>

          <!-- Body -->
          <div style="padding: 28px 26px;">
            <h2 style="
              font-size: 18px;
              color: #0f172a;
              margin-bottom: 10px;
            ">
              Email Verification
            </h2>

            <p style="
              font-size: 14px;
              color: #334155;
              line-height: 1.6;
              margin-bottom: 20px;
            ">
              Thank you for registering with <strong>ATAS Laboratories LLP</strong>.
              Please use the verification code below to complete your signup.
            </p>

            <!-- OTP Box -->
            <div style="
              background: #f1f5f9;
              border: 1px dashed #38bdf8;
              border-radius: 10px;
              padding: 18px;
              text-align: center;
              margin: 24px 0;
            ">
              <p style="
                font-size: 13px;
                color: #475569;
                margin-bottom: 6px;
              ">
                Your One-Time Password (OTP)
              </p>
              <div style="
                font-size: 28px;
                font-weight: bold;
                letter-spacing: 6px;
                color: #0284c7;
              ">
                ${otp}
              </div>
            </div>

            <p style="
              font-size: 13px;
              color: #475569;
              line-height: 1.6;
            ">
              This OTP is valid for <strong>10 minutes</strong>.
              For security reasons, please do not share this code with anyone.
            </p>

            <p style="
              font-size: 13px;
              color: #64748b;
              margin-top: 20px;
            ">
              If you did not request this verification, you can safely ignore this email.
            </p>
          </div>

          <!-- Footer -->
          <div style="
            background: #f8fafc;
            padding: 16px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          ">
            <p style="
              font-size: 12px;
              color: #64748b;
              margin: 0;
            ">
              © ${new Date().getFullYear()} ATAS Laboratories LLP. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    `,
  });
}
