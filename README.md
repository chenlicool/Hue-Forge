# Hue Forge
颜色系统生成工具，基于 HSB 与 WCAG 对比度规则生成和调整色阶。

## 快速启动
1. 在仓库根目录安装依赖：`npm install`
2. 启动开发服务：`npm run dev`
3. 默认访问地址：`http://localhost:3000`

## 功能特性
- 生成多色相色阶矩阵
- 调整亮度基线与饱和度/亮度曲线
- 查看对比度与 WCAG 等级
- 导出 `CSS` / `Tailwind` / `Tailwind 4` / `Tokens`
- 支持复制结构化 Tokens 文本直接提供给 AI 使用
- 导出面板支持 `AI Export` 开关，可复制带上下文提示的 AI 友好文本

## 目录结构
- `archive/`：历史备份与遗留配置归档
- `scripts/`：辅助脚本
- `src/`：前端源码
- `archive/color-system-v2.0.zip`：迁移来源压缩备份
- `ARCHITECTURE.md` / `MEMORY.md` / `CHANGELOG.md`：过程文档

## 辅助命令
- `npm run check:contrast`：运行颜色对比度辅助脚本

## 环境依赖
- Node.js 18+（待确认/未知：更低版本兼容性）
- npm
