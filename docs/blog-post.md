> **Archived unverified draft. Do not submit or publish this text as factual evidence of Kiro use, a live deployment, or a completed submission.** Claims below about development chronology, Kiro execution, event rules, deadlines and deployment status have not been verified. The original text is preserved for reference. Use [the current submission draft](submission-draft.md) and [the local demo runbook](demo-runbook.md) instead, and complete their verification checks before any authorized publication.

# Blog Post �� "One Seed, Two Pumpkins: a Skeleton Crew template you can plant"

*Publish on a third-party platform (Dev.to / Medium / ��� / ֪��) during the hackathon period for the Bonus Blog prize. Copy below in EN + ZH. Replace placeholders before publishing.*

---

## English version

**Title:** One Seed, Two Pumpkins: building a Skeleton Crew template for Kiroween 2026

Every Halloween, the same two problems return: families wandering streets asking *where is the candy?* (and *is it safe for my kid?*), and parties that dissolve into phones until someone shouts *let's tell a scary story*.

For [Kiroween 2026](https://kiroween.devpost.com/)'s Skeleton Crew category �� one lean template + two distinct apps �� I built **PumpkinSeed**: a festival-app seed you plant rather than a platform you deploy.

**The template (`@pumpkin-seed/core`) is deliberately small:**

- **Festival skins as data.** A skin is a map of CSS variables (`--ps-accent`, `--ps-font-display`��). Halloween, Christmas and Lunar New Year are ~30-line objects; components never know they exist. Adding a festival is a data change, not a refactor.
- **A realtime data layer with two roots.** One tiny `DataLayer` interface (`list/insert/update/remove/subscribe`) with two adapters: a `localStorage` + `BroadcastChannel` adapter that makes **two browser tabs sync live with zero accounts**, and a Supabase adapter for hosted realtime. Apps are written once against the interface; a single env-pair decides the backend.
- **A spooky UI kit + shared chrome.** Buttons, cards, toasts, modals, confetti �� and one `AppChrome` that puts the festival motif, skin switcher and backend badge on both apps, so the lineage is visible at a glance.
- **60-line i18n.** EN + ����, detect/persist/fallback. No library.

**Pumpkin #1 �� Trick-or-Treat Map.** Houses pin their candy (chocolate? full-size bars? ?? allergy-friendly?), candy hours, and a spookiness rating. Parents filter by allergen and open-now; kids thank houses into a leaderboard. Night-mode Leaflet, glowing pins.

**Pumpkin #2 �� Ghost Story Relay.** A 6-character code opens a room. Everyone adds one sentence at a time; ?? votes surface the spookiest lines; a campfire-narrator voice (SpeechSynthesis, pitch 0.75) reads the story aloud; one tap shares the finished tale. Zero shared feature code with the map �� only the seed.

**The Kiro part.** The whole repo is spec-driven: EARS-notation requirements, designs, and task lists for all three packages live in `.kiro/specs/`; steering files pin the stack and the CSS-class treaty; agent hooks run typechecks on save and guard `/.kiro` from being gitignored (a Kiroween disqualifier). Writing the DataLayer contract *before either app existed* is why two apps could share nothing but still ship as one family.

Repo: `github.com/<your-handle>/pumpkin-seed` �� Live: map `<URL>` �� relay `<URL>`

*#KiroweenHackathon26*

---

## ���İ�

**����:** һ������,��ֻ�Ϲ�:Kiroween 2026�����ô�Ա��������ģ���淨

ÿ����ʥ�ڶ���ͬ����������:��������������(**�ļҷ���?��������?**),�ɶ��ϴ�ҵ�ͷ���ֻ�ֱ������˵(**�����������°�**)��

Kiroween 2026 �� Skeleton Crew ����Ҫ��:**һ������ģ�� + ����������������Ȼ��ͬ�� App**���������� **PumpkinSeed(�Ϲ�����)**��������ģ��,�����ǲ���ƽ̨��

**ģ�������С:**
- **����Ƥ��������**:Ƥ������һ�� CSS ����,��ʥ��/ʥ��/���ڸ�Լ 30 �ж���,�ӽ��ղ��ø����;
- **˫���ʵʱ���ݲ�**:һ�� `DataLayer` �ӿ�,��������������������� `localStorage`+`BroadcastChannel`(��������ǩҳ����ʵʱͬ����ʾ,**���˺�**)�� Supabase �й�ʵʱ;
- **���� UI �׼� + �������**:���� App ͷ������ͬһ��"����",ѪԵһ�ۿɼ�;
- **60 �е� i18n**(��Ӣ˫��),�����⡣

**�Ϲ�һ�š����ǵ�ͼ**:�˼ұ�ע�������ࡢ����ԭ������ʱ��,�ҳ���"�޹���ԭ/ֻ�ڷ���ʱ��"ɸѡ,��лͶƱ�����а�;ҹɫ��ͼ + �����Ϲ϶���

**�Ϲ϶��š������½���**:6 λ�����뿪��,ÿ�˽�һ��,?? ͶƱѡ�������˵�һ��,���е����ʶ��߰ѹ��¶�����,���һ�����Ʒ��������� App ��ҵ��������ص�����ֻ�������ӡ�

**Kiro ����**:ȫ�ֿ� spec ����,`.kiro/specs/` ���� EARS ��ʽ������/���/�����嵥,`steering/` ��������ջ�� CSS ������Լ,hooks �ڱ���ʱ�Զ������ͼ�顢����ֹ `/.kiro` �� gitignore(Kiroween �����ȡ���ʸ�)����д��Լ�ٳ�Ӧ��,������ App �ܹ��������ȴ��һ�������ԭ��

�ֿ�:`github.com/<����û���>/pumpkin-seed` �� ����:��ͼ `<URL>` �� ���� `<URL>`

*#KiroweenHackathon26*

