# AGENTS.md (总纲)

版本号: v1.0
生效时间: YYYY-MM-DD
适用对象: 所有 AI 编码 / 重构 / 文档生成行为

## 1. 适用范围
本规则适用于 {{PROJECT_NAME}} 及其所有子项目/子目录。

## 2. 强制规则 (MUST)
1. 禁止修改已标记为 Protected 的文件或服务，除非获得明确授权。
2. 所有实质性改动前必须完成“影响面判断”，并更新 `MEMORY.md`。
3. 若规则冲突，以更严格者为准；子规则不得放宽总纲限制。
4. 新功能必须遵循“原子化拆解”原则（先最小单元，再组合）。
5. 文档第一语言必须为中文；必要时中文在前英文在后，语义一致。
6. 不确定信息必须标注“待确认/未知”。

## 3. 禁止行为 (MUST NOT)
1. 禁止重写整篇文档，只允许最小补丁。
2. 未审阅 `ARCHITECTURE.md` 禁止改架构。
3. 未更新文档而先改代码视为违规。

## 4. 规则索引
- AI 灵魂定义 → `SOUL.md`
- 前端规则 → `.rules/AGENTS_FRONTEND.md`
- 后端规则 → `.rules/AGENTS_BACKEND.md`
- 测试规则 → `.rules/AGENTS_TEST.md`
- 文档规则 → `.rules/AGENTS_DOCS.md`

## 5. 强制执行流程 (ENFORCEMENT)
1. 影响面判断
2. 必要时更新 `ARCHITECTURE.md` / `API.md` / `README.md`
3. 执行代码修改
4. 更新 `MEMORY.md` / `CHANGELOG.md`
