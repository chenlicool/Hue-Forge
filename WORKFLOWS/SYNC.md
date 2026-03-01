# 任务完成后同步更新工作流

任何实质性改动完成后，必须同步文档。

## 强制顺序
1. 影响面判断（Impact Analysis）
2. 更新 `MEMORY.md`（含影响面判断与结果）
3. 需要时更新 `ARCHITECTURE.md`
4. 需要时更新 `README.md` / `API.md`
5. 更新 `CHANGELOG.md`

## 版本对齐
- 若存在 `package.json` 或其他版本文件，确保与 `CHANGELOG.md` 一致。

## 顺序规范
- `MEMORY.md` 必须按时间倒序维护，最新记录置顶。
