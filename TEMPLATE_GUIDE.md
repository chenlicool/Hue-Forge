# 通用 AI 开发规范 0-1 启动包（模板组）说明

本模板组用于项目“从 0 开始”阶段建立统一规范，确保 AI 与人类协作不偏航。

## 目录结构
```text
template/
├── AGENTS.md
├── SOUL.md
├── ARCHITECTURE.md
├── API.md
├── CHANGELOG.md
├── MEMORY.md
├── README.md
├── STACK.md
├── TEMPLATE_GUIDE.md
├── .rules/
│   ├── AGENTS_BACKEND.md
│   ├── AGENTS_DOCS.md
│   ├── AGENTS_FRONTEND.md
│   └── AGENTS_TEST.md
└── WORKFLOWS/
    ├── INIT.md
    └── SYNC.md
```

## 使用方式
1. 将本模板组复制到新项目根目录。
2. 优先填写 `STACK.md`，明确技术栈计划。
3. 按 `WORKFLOWS/INIT.md` 执行初始化流程。
4. 任何改动遵循 `AGENTS.md` + `.rules/` 约束。

## 强约束说明
- 所有文档的一级标题为固定结构，禁止删除或重命名。
- 仅允许在既定标题下追加内容，禁止整段重写。
- 中文优先；英文可附加，但中文在前。
- `SOUL.md` 定义 AI 价值观与行为边界，属于强约束文档。
- `MEMORY.md` 必须按时间倒序维护，最新记录置顶。
- 无后端项目的 `API.md` 改为“内部协议/组件通信说明”。

## 占位符说明
- `{{PROJECT_NAME}}`：项目名
- `YYYY-MM-DD` / `YYYY-MM-DD HH:MM`：实际时间
