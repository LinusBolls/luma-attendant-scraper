import fs from "fs";

import OpenAI from "openai";

import { LumaClient } from "./luma";
import { askQuestion } from "./util/askQuestion";
import { env } from "./env";
import { LinkedinClient } from "./linkedin";
import { parseProfileSections } from "./linkedin/requests/getProfileSections";

async function signIn() {
  const email = "qlaiseq@gmail.com";

  await LumaClient.requestEmailCode(email);

  const rawCode = await askQuestion("enter the code: ");

  const code = rawCode.trim();

  const { luma, data, authToken } = await LumaClient.fromEmailCode(email, code);

  console.log("authToken:", authToken);
  console.log("welcome", data.user.name);
}

async function getProfileInfo(linkedinHandle: string) {
  const linkedin = new LinkedinClient(
    env.linkedin.csrfToken,
    env.linkedin.sessionToken
  );

  const profileUrn = (
    await (
      await linkedin.profile.getPage(
        "https://www.linkedin.com" + linkedinHandle
      )
    ).text()
  ).match(/urn:li:fsd_profile:[A-Za-z0-9]+/)?.[0]!;

  const profileSections = parseProfileSections(
    await linkedin.profile.getSections(profileUrn)
  );

  return { data: profileSections };
}

async function main() {
  const luma = new LumaClient(env.luma.sessionToken);

  const guests = await luma.event.getGuests("evt-KZ3GVPQwrc0OFpU", "hzdtCD");

  const guestsWithLinkedin = guests.entries.filter((i) => i.linkedin_handle);

  console.log("fetching data about", guestsWithLinkedin[0].name);

  const profileData = await getProfileInfo(
    guestsWithLinkedin[0].linkedin_handle!
  );

  console.log(profileData.data.experiences?.[0]);

  await fs.promises.writeFile("./profile.json", JSON.stringify(profileData), {
    encoding: "utf-8",
  });

  // console.log(
  //   // guests.entries.length,
  //   // guests.entries.filter((i) => i.linkedin_handle).length,
  //   guests.entries.filter((i) => !i.linkedin_handle).map((i) => i.name)
  // );

  // const openai = new OpenAI({ apiKey: env.openai.apiKey });

  // const response = await openai.chat.completions.create({
  //   model: "gpt-4o",
  //   messages: [],
  //   temperature: 1,
  //   max_tokens: 256,
  //   top_p: 1,
  //   frequency_penalty: 0,
  //   presence_penalty: 0,
  // });
  // return response;
}
main();
