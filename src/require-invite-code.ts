import prompts from "prompts";
import chalk from "chalk";
import fetch from "node-fetch";
import open from "open";
import emailValidator from "email-validator";

export default async function requireInviteCode(): Promise<void> {
  const { whatToDo } = await prompts({
    name: "whatToDo",
    type: "select",
    message:
      "nbundle for Developers is in early access and requires an invite code.",
    choices: [
      {
        title: "I don't have any invite codes yet, sign me up",
        value: "no-code",
      },
      {
        title: "I have an invite code, continue",
        value: "has-code",
      },
    ],
    initial: 0,
  });
  if (!whatToDo) {
    console.error(
      chalk.red(
        "Invite code is required. You can sign up for early access at https://developers.nbundle.com/early-access."
      )
    );
    process.exit(1);
  }

  if (whatToDo === "no-code") {
    await open("https://developers.nbundle.com/early-access");
    console.log(
      "Open https://developers.nbundle.com/early-access to sign up for early access."
    );
    process.exit(0);
  }

  const { code } = await prompts({
    name: "code",
    type: "text",
    message: "What is your invite code?",
    validate: (value) => {
      const trimmedValue = value.trim();
      if (trimmedValue.length === 0) return "Please enter an invite code.";
      return true;
    },
  });
  if (!code) {
    console.error(
      chalk.red(
        "Invite code is required. You can sign up for early access at https://developers.nbundle.com/early-access."
      )
    );
    process.exit(1);
  }

  const preVerify = await fetch(
    "https://developers.nbundle.com/api/v1/invite-verifications",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    }
  );
  if (!preVerify.ok) {
    const json = (await preVerify.json()) as { message: string };
    console.error(
      chalk.red(
        `${
          preVerify.status === 404 ? "Invite code is invalid." : json.message
        } Please try again or sign up for early access at https://developers.nbundle.com/early-access if you haven't already.`
      )
    );
    process.exit(1);
  }
  const preVerifyJson = (await preVerify.json()) as { email: string };

  const { email } = await prompts({
    name: "email",
    type: "text",
    message: `What is your email address that got this invite code? (${preVerifyJson.email})`,
    validate: async (value): Promise<boolean | string> => {
      const trimmedValue = value.trim();
      if (trimmedValue.length === 0) return "Email is required.";
      if (!emailValidator.validate(trimmedValue)) return "Email is invalid.";
      return true;
    },
  });
  if (!email) {
    console.error(
      chalk.red(
        "Email is required to verify if you're the owner of the invite code. Please try again or sign up for early access at https://developers.nbundle.com/early-access if you haven't already."
      )
    );
    process.exit(1);
  }

  const verify = await fetch(
    "https://developers.nbundle.com/api/v1/invite-verifications",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, email }),
    }
  );
  if (!verify.ok) {
    const json = (await verify.json()) as { message: string };
    console.error(
      chalk.red(
        `${
          verify.status === 404 ? "Invite code is invalid." : json.message
        } Please try again or sign up for early access at https://developers.nbundle.com/early-access if you haven't already.`
      )
    );
    process.exit(1);
  }
}
