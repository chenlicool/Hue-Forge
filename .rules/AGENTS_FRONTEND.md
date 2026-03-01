# AGENTS_FRONTEND.md (前端法典)

版本号: v1.0
生效时间: YYYY-MM-DD
适用对象: 前端代码与 UI 交互修改

## 1. 适用范围 (Scope)
所有 `.tsx`, `.ts`, `.css`, `DESIGN_TOKENS` 及 UI 交互逻辑的修改。

## 2. 强制规则 (MUST)
- **组件分层**：遵循约定的组件分层/原子化规则，不得越级引用。
- **Token 语义化**：颜色/间距/字号必须使用设计 Token 或 CSS Variables。
- **国际化优先**：所有文案必须走 i18n 管理（如 `t()`），若暂无 i18n，必须记录为待办。
- **函数式组件**：组件必须为函数式，避免类组件。
- **数据层隔离**：组件内禁止直接调用 `fetch`/`axios`，统一走 `hooks` 或 `services`。
- **防御性编程**：接口返回必须做结构校验（如 Zod 或项目约定方案）。

## 3. 禁止行为 (MUST NOT)
- 禁止硬编码颜色值（如 `#FFF`）。
- 禁止无说明使用 `px` 作为间距单位（1px 边框/固定 Icon 除外）。
- 禁止为 UI 直接改后端接口契约。

## 4. 允许例外 (EXCEPTION)
- `px` 仅允许用于 `1px/0.5px` 边框或固定尺寸 Icon，需标注 `// token-exception: reason`。
- 临时调试允许 `console.log`，但提交前必须删除。

## 5. 违规处理 (ENFORCEMENT)
- 发现硬编码颜色、未走 i18n、越级引用时必须拒绝修改并回滚。
