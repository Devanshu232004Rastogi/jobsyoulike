import { compileThankYouEmailTemplate, sendMail } from "@/lib/mail";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { email, fullName } = await req.json();

    const response = await sendMail({
      to: email,
      name: fullName,
      subject: "Thank you for applying",
      body: compileThankYouEmailTemplate(fullName),
    });

    if (response?.messageId) {
      return NextResponse.json({ message: "Delivered" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Mail not sent" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error occurred", error },
      { status: 500 }
    );
  }
};
