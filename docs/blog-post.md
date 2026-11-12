> **Archived unverified draft. Do not submit or publish this text as factual evidence of Kiro use, a live deployment, or a completed submission.** Claims below about development chronology, Kiro execution, event rules, deadlines and deployment status have not been verified. The original text is preserved for reference. Use [the current submission draft](submission-draft.md) and [the local demo runbook](demo-runbook.md) instead, and complete their verification checks before any authorized publication.

# Blog Post — "One Seed, Two Pumpkins: a Skeleton Crew template you can plant"

*Publish on a third-party platform (Dev.to / Medium / 掘金 / 知乎) during the hackathon period for the Bonus Blog prize. Copy below in EN + ZH. Replace placeholders before publishing.*

---

## English version

**Title:** One Seed, Two Pumpkins: building a Skeleton Crew template for Kiroween 2026

Every Halloween, the same two problems return: families wandering streets asking *where is the candy?* (and *is it safe for my kid?*), and parties that dissolve into phones until someone shouts *let's tell a scary story*.

For [Kiroween 2026](https://kiroween.devpost.com/)'s Skeleton Crew category — one lean template + two distinct apps — I built **PumpkinSeed**: a festival-app seed you plant rather than a platform you deploy.

**The template (`@pumpkin-seed/core`) is deliberately small:**

- **Festival skins as data.** A skin is a map of CSS variables (`--ps-accent`, `--ps-font-display`…). Halloween, Christmas and Lunar New Year are ~30-line objects; components never know they exist. Adding a festival is a data change, not a refactor.
- **A realtime data layer with two roots.** One tiny `DataLayer` interface (`list/insert/update/remove/subscribe`) with two adapters: a `localStorage` + `BroadcastChannel` adapter that makes **two browser tabs sync live with zero accounts**, and a Supabase adapter for hosted realtime. Apps are written once against the interface; a single env-pair decides the backend.
- **A spooky UI kit + shared chrome.** Buttons, cards, toasts, modals, confetti — and one `AppChrome` that puts the festival motif, skin switcher and backend badge on both apps, so the lineage is visible at a glance.
- **60-line i18n.** EN + 中文, detect/persist/fallback. No library.

**Pumpkin #1 — Trick-or-Treat Map.** Houses pin their candy (chocolate? full-size bars? 🌾 allergy-friendly?), candy hours, and a spookiness rating. Parents filter by allergen and open-now; kids thank houses into a leaderboard. Night-mode Leaflet, glowing pins.

**Pumpkin #2 — Ghost Story Relay.** A 6-character code opens a room. Everyone adds one sentence at a time; 👻 votes surface the spookiest lines; a campfire-narrator voice (SpeechSynthesis, pitch 0.75) reads the story aloud; one tap shares the finished tale. Zero shared feature code with the map — only the seed.

**The Kiro part.** The whole repo is spec-driven: EARS-notation requirements, designs, and task lists for all three packages live in `.kiro/specs/`; steering files pin the stack and the CSS-class treaty; agent hooks run typechecks on save and guard `/.kiro` from being gitignored (a Kiroween disqualifier). Writing the DataLayer contract *before either app existed* is why two apps could share nothing but still ship as one family.

Repo: `github.com/<your-handle>/pumpkin-seed` · Live: map `<URL>` · relay `<URL>`

*#KiroweenHackathon26*

---

## 中文版

**标题:** 一颗种子,两只南瓜:Kiroween 2026「骷髅船员」赛道的模板玩法

每年万圣节都有同样两个问题:孩子们满街找糖(**哪家发糖?过不过敏?**),派对上大家低头玩手机直到有人说(**来讲个鬼故事吧**)。

Kiroween 2026 的 Skeleton Crew 赛道要求:**一个精简模板 + 用它做出的两个截然不同的 App**。我做的是 **PumpkinSeed(南瓜种子)**——种下模板,而不是部署平台。

**模板刻意做小:**
- **节日皮肤即数据**:皮肤就是一组 CSS 变量,万圣节/圣诞/春节各约 30 行对象,加节日不用改组件;
- **双后端实时数据层**:一个 `DataLayer` 接口,两个适配器——浏览器内 `localStorage`+`BroadcastChannel`(开两个标签页就能实时同步演示,**零账号**)和 Supabase 托管实时;
- **暗黑 UI 套件 + 共享外壳**:两个 App 头部戴着同一套"外套",血缘一眼可见;
- **60 行的 i18n**(中英双语),不引库。

**南瓜一号·讨糖地图**:人家标注发糖种类、过敏原、发糖时段,家长按"无过敏原/只在发糖时段"筛选,感谢投票上排行榜;夜色地图 + 发光南瓜钉。

**南瓜二号·鬼故事接龙**:6 位房间码开房,每人接一句,👻 投票选出最吓人的一句,还有低音朗读者把故事读出来,完稿一键复制分享。两个 App 的业务代码零重叠——只共享种子。

**Kiro 部分**:全仓库 spec 驱动,`.kiro/specs/` 里是 EARS 格式的需求/设计/任务清单,`steering/` 钉死技术栈和 CSS 命名条约,hooks 在保存时自动跑类型检查、并防止 `/.kiro` 被 gitignore(Kiroween 会因此取消资格)。先写契约再长应用,是两个 App 能共享零代码却像一个家族的原因。

仓库:`github.com/<你的用户名>/pumpkin-seed` · 在线:地图 `<URL>` · 接龙 `<URL>`

*#KiroweenHackathon26*
