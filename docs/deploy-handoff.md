> **Archived unverified draft. Do not submit or publish this text as factual evidence of Kiro use, a live deployment, or a completed submission.** Claims below about development chronology, Kiro execution, event rules, deadlines and deployment status have not been verified. The original text is preserved for reference. Use [the current submission draft](submission-draft.md) and [the local demo runbook](demo-runbook.md) instead, and complete their verification checks before any authorized publication.

# ?? �û������嵥 �� �ӱ��ص��ύ(ȫ���㱾�������Ĳ���)

> ��(����)�ѰѴ��롢spec������ȫ������;����ÿһ����ֻ��Ҫ������㰴,Լ 40 ���ӡ�
> �� ? ����Ӳ��ֹ:**������� 12/2 �賿 4:00(����),�ύ 12/5 �� 6:00(����)**��

## 0. ����Ԥ��(��ѡ,���������)

�������������������ں�̨����:
- ���ǵ�ͼ �� http://localhost:5173
- �����½��� �� http://localhost:5174

**˫����ʾ�淨**:ͬһ App ����������,һ�ߵ�"лл!"/��һ��,��һ��ʵʱ���֡�

�Ժ���������:��ĿĿ¼�� `pnpm dev:map` �� `pnpm dev:story`��

## 1. �˺�����(����,~20 ����)

1. **Devpost** ע�� �� https://kiroween.devpost.com (Join hackathon)
2. **Kiro** ע�� �� https://app.kiro.dev/signin,���� Kiro User ID(kiro.dev/account)
3. ? **���� 4000 credits** �� ����ҳ Resources ��ǩ�ı���(��Ҫʵ����֤�Ļ����㱾�����)
4. ���� Kiro Discord #kiroween-hackathon

## 2. ���ֿ� + �ƴ���(~10 ����)

1. GitHub �½�**����**�ֿ�,���ֽ��� `pumpkin-seed`(��Ҫ��ѡ�Զ����� README/LICENSE,��������)
2. ����ĿĿ¼����ȥ:

```bash
cd "C:\Users\A\.zcode\workspace\draft-07f1882d-dea8-4f86-b516-8d66043b2a60\pumpkin-seed"
git remote add origin https://github.com/<����û���>/pumpkin-seed.git
git push -u origin main
```

3. �ֿ� About ����д:���� + Website(������,�����)+ **Topics �� `MIT` ���� About �Ҳ� License ��ѡ MIT**(����Ҫ��ԴЭ���� About �ɼ�)

## 3. Supabase(�й�ʵʱ���,~10 ����)

1. https://supabase.com ע��(���)�� New project(����ѡ Singapore,���й���)
2. SQL Editor �� ճ�� `docs/supabase-schema.sql` ȫ������ �� Run
3. Project Settings �� API:���� **Project URL** �� **anon public key**
4. ������һ��(��ѡ):

```bash
cd apps/trick-or-treat-map
cp .env.example .env.local   # ���� URL �� key
cd ../.. && pnpm dev:map
```

ҳͷ���´� `?? local` ��� `? live` ���ɹ���

## 4. ����(������̬վ,~15 ����)

�Ƽ� **Netlify**(���,���㰴):

1. https://app.netlify.com �� GitHub ��¼ �� Add new site �� Import an existing project �� ѡ `pumpkin-seed`
2. ��������(��ֻ�����ͼ):
   - Base directory: `apps/trick-or-treat-map`
   - Build command: `pnpm install --no-frozen-lockfile && pnpm build:map` �� ʵ�ʲ���Ŀ¼д `apps/trick-or-treat-map/dist`
   - ���߸���:Base directory ����,Build command `pnpm install && pnpm --filter trick-or-treat-map build`,Publish directory `apps/trick-or-treat-map/dist`
3. Environment variables ������ `VITE_SUPABASE_URL` �� `VITE_SUPABASE_ANON_KEY`
4. Deploy �� �õ� `https://xxx.netlify.app`
5. ����һ�β���ڶ���վ��(ͬһ�ֿ�):Base directory `apps/ghost-story-relay`,Publish directory `apps/ghost-story-relay/dist`

> ��ѡ:Vercel ͬ��(Root Directory �ֱ���Ϊ���� app Ŀ¼,framework ѡ Vite)��
> ����������� URL ���� `README.md` �� `docs/blog-post.md`��`docs/social-posts.md` �� `<URL>` ռλ��,�ύ���͡�

## 5. ��ʾ��Ƶ(~30 ����,�� docs/video-script.md ��)

1. OBS Studio(���)¼��,1440��900,���ű��־���,�ܳ� < 3 ����
2. �ϴ� YouTube(**����**),����:`PumpkinSeed �� Kiroween 2026 (Trick-or-Treat Map + Ghost Story Relay)`
3. ���� YouTube ����

## 6. �ύǰ����嵥(~10 ����)

- [ ] �ֿ⹫��,MIT Э���� About �ɼ�,`/.kiro` Ŀ¼�ڲֿ��Ŀ¼**��δ�� gitignore**
- [ ] ���� App URL �ɹ�������,����ʵʱͬ������
- [ ] YouTube ��Ƶ < 3 ���ӡ��������ް�Ȩ����
- [ ] �����ѷ�������ƽ̨(docs/blog-post.md �����ĺ����Ӽ��ɷ�)
- [ ] �罻���� #KiroweenHackathon26(docs/social-posts.md)
- [ ] Devpost �ύ����:����ѡ **Skeleton Crew**,���� app �ļ���·��д���(`apps/trick-or-treat-map`��`apps/ghost-story-relay`),Kiro ʹ��˵��ճ�� `docs/kiro-writeup.md`
- [ ] ? **����ʱ�� 12/5 �� 6:00 ǰ�� Submit**(���� 12/4 ���ϵĻ���)

## 7. �� Bonus ��(��ѡ�ӷ�)

- **Bonus Blog**(100 �� �� 2000 credits):���ͷ������������� Devpost
- **Social Blitz**(5 �� �� 3 ���� Pro+):����ǩ�����ӱ�ɾ
- **Best Demo**($1,000):��Ƶ��˫��ʵʱͬ���Ƕ���ɱ���,�����

