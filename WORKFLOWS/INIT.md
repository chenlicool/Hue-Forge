# 项目规范文档初始化工作流 (0 -> 1)

当项目从 0 开始时，必须先完成“规则体系落地”，再开始编码。

## 阶段 0：无技术栈文件
1. 建立规则体系：
   - `AGENTS.md`
   - `SOUL.md`
   - `.rules/` 全部法典
   - `MEMORY.md` / `ARCHITECTURE.md` / `README.md` / `API.md` / `CHANGELOG.md`
2. 填写 `STACK.md`：明确计划技术栈与部署方式。
3. `CHANGELOG.md` 初始化版本为 `0.0.1`。

## 阶段 1：脚手架完成后
1. 扫描项目结构与技术栈文件（如 `package.json`）。
2. 对齐版本号与 `CHANGELOG.md`。
3. 校验 `STACK.md` 计划与实际技术栈是否一致。

## 初始化完成后
- 所有后续任务必须遵循“影响面 → MEMORY → 变更”的强制流程。
