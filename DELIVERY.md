# TripMate 交付封装说明

## 交付内容

这个包是 TripMate · 旅程伴侣的完整项目封装，包含：

- `docs/index.html`：可直接打开的离线 Demo，适合演示核心流程。
- `apps/web/`：Next.js Web App。
- `apps/mobile/`：Expo / React Native App。
- `server/`：Express API Server。
- `packages/shared/`：跨端共享算法与类型。
- `supabase/`：数据库迁移和种子数据。

## 已封装功能

### 分享码组团

- 创建旅程时自动生成 6 位邀请码。
- 同行人通过邀请码加入旅程。
- 支持重新生成邀请码。
- 加入逻辑是幂等的：同一个人重复输入同一邀请码不会重复加入。
- Web、Mobile、Server、Supabase schema 均已包含对应能力。

关键文件：

- `supabase/migrations/0001_init.sql`
- `packages/shared/src/invite.ts`
- `server/src/routes/trips.ts`
- `apps/web/app/trips/join/page.tsx`
- `apps/mobile/src/screens/JoinTripScreen.tsx`

### 多币种记账与最终 AA 汇率

- 每笔账单可记录独立币种，例如 CNY / JPY / USD。
- 结算时统一折算到旅程结算币种。
- Server / Web 使用结算日汇率计算。
- 离线 Demo 使用浏览器可访问的公开汇率 API，失败时自动使用兜底汇率。

关键文件：

- `packages/shared/src/settle.ts`
- `server/src/lib/fx.ts`
- `server/src/routes/expenses.ts`
- `apps/web/lib/fx.ts`
- `apps/web/app/trips/[id]/settlement/page.tsx`
- `docs/index.html`

### 明确哪些人参与 AA

- 每笔账单明确记录参与分摊的人。
- 支持三种分账方式：
  - 等额
  - 加权 / 按份数
  - 自定义金额
- 自定义金额会校验参与者分摊合计必须等于账单总额。

关键文件：

- `supabase/migrations/0004_custom_split.sql`
- `apps/web/app/trips/[id]/expenses/new/form.tsx`
- `apps/web/app/trips/[id]/expenses/page.tsx`
- `apps/mobile/src/screens/AddExpenseScreen.tsx`
- `apps/mobile/src/screens/ExpensesScreen.tsx`
- `docs/index.html`

## 本地预览 Demo

直接打开：

```text
docs/index.html
```

或用本地服务：

```bash
cd trip-companion/docs
python3 -m http.server 8080
```

然后访问：

```text
http://localhost:8080/
```

## GitHub Pages Demo

线上 Demo：

```text
https://sunpeichun4092-crypto.github.io/trip-companion/
```

每次 push 到 `main` 后，`.github/workflows/pages.yml` 会自动发布 `docs/`。

## 完整 App 启动

安装依赖：

```bash
npm install
```

Web：

```bash
cp apps/web/.env.example apps/web/.env.local
npm run dev:web
```

Server：

```bash
cp .env.example server/.env
npm run dev:server
```

Mobile：

```bash
cp .env.example apps/mobile/.env
npm run dev:mobile
```

## 数据库

使用 Supabase：

```bash
supabase link --project-ref <your-ref>
supabase db push
```

迁移文件：

- `0001_init.sql`：基础表、邀请码、成员、账单等。
- `0002_rls.sql`：RLS 权限。
- `0003_storage.sql`：相册 Storage。
- `0004_custom_split.sql`：自定义金额分账。

## 验证命令

```bash
npm --workspace packages/shared test
npm --workspace server run build
```

注意：Web 完整 build 需要配置 Supabase / OpenAI 等环境变量。
