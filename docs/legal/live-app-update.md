# Official app landing correction — 2026-09-08

The user confirmed this is the live Petty app's official landing page, not a prelaunch signup service. They also confirmed there are no additional support phone number, mail-order business registration number or store listing URLs to provide at this time.

## Applied

- Use `https://app.petty.im`, already identified in the project README, for app-start actions in all three languages.
- Hide store badges until actual HTTPS store listing URLs are configured. Do not label a web-app link as an App Store listing.
- Remove signup forms and retired signup copy from live dictionaries. Retire `/api/waitlist` with HTTP 410 without reading/storing submitted data or connecting to its former database.
- Preserve existing databases and data; no historical records were deleted. Prior data handling remains an operational task, and the privacy text states the applicable purpose-completion/erasure handling rather than claiming deletion has occurred.
- Terms describe the official website, live app connection and support; account, conversation and payment terms remain those presented in the actual app. No invented prices, refund windows or app-contract provisions.
- One reusable `BusinessInformation` component renders the supplied legal business identity on the landing footer and the top/footer of both policy documents. Labels are localized; the legal name, representative and address retain their Korean originals.

## Source of business data

`content/legal/business.ts`, already entered from the user's registration document in the prior policy work:

- 스페시파이(specify), 대표 김현중
- 656-14-02899
- 서울특별시 동대문구 왕산로 288, 902호(전농동, 에스앤제이프리미안)
- support@specify.app

No phone number, additional registration number or unsupported certification was invented. Policy documents remain Korean originals as before. The retained Zoho/account and hosting verification notes in the previous legal research document are still relevant; this change does not verify the external mail configuration.

## Reference checked

[전자상거래 등에서의 소비자보호에 관한 법률 제10조](https://law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1029561875) was checked for business-identity display context. This implementation reports the supplied information; it does not certify all legal obligations have been satisfied.
