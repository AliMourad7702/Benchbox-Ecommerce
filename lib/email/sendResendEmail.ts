import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAILS = ["admin@benchbox.sa", "sales@benchbox.sa"];

interface EmailContent {
  subject: string;
  html: string;
}

interface SendEmailOptions {
  userEmail: string;
  userContent: EmailContent;
  adminContent: EmailContent;
  attachment: Buffer;
}

export async function sendResendEmailBatch({
  userEmail,
  userContent,
  adminContent,
  attachment,
}: SendEmailOptions): Promise<void> {
  try {
    // Send to user
    const userRes = await resend.emails.send({
      from: "BenchBox Quotes <onboarding@resend.dev>",
      to: userEmail,
      subject: userContent.subject,
      html: userContent.html,
      attachments: [
        {
          filename: "quotation.pdf",
          content: attachment.toString("base64"),
        },
      ],
    });

    // Send to admins
    const adminRes = await resend.emails.send({
      from: "BenchBox Quotes <onboarding@resend.dev>",
      to: ADMIN_EMAILS,
      subject: adminContent.subject,
      html: adminContent.html,
      attachments: [
        {
          filename: "quotation.pdf",
          content: attachment.toString("base64"),
        },
      ],
    });

    console.log("Resend user email response:", userRes);
    console.log("Resend admin email response:", adminRes);
  } catch (error) {
    console.error("Error sending batch email with Resend:", error);
    throw error;
  }
}
