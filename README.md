# Hue Forge

![Hue Forge Cover](docs/cover.svg)

Hue Forge 是一个面向设计系统和品牌色板工作的颜色系统生成工具。它基于 HSB 曲线模型与 WCAG 对比度规则，帮助你生成、调整、检查并导出一整套可落地的色阶。

## 项目定位

- 面向需要快速生成多色相、多层级色板的设计与前端工作流
- 把“颜色生成、可读性检查、代码导出”收敛在同一个本地前端工具里
- 当前为纯前端单页应用，不依赖后端服务

## 核心能力

- 生成多色相色阶矩阵，并保持各列 step 结构对齐
- 调整 `Base Scale`、单列饱和度曲线和亮度曲线
- 同时查看黑字 / 白字对比度与 WCAG 等级
- 导出 `CSS`、`Tailwind`、`Tailwind 4`、`Tokens`
- 支持 `AI Export`，复制带上下文说明的结构化文本给 AI 使用

## 快速开始

1. 安装依赖：`npm install`
2. 启动开发环境：`npm run dev`
3. 打开浏览器访问：`http://localhost:3000`

## 常用命令

```bash
npm run dev
npm run build
npm run lint
npm run check:contrast
```

## GitHub Pages 部署

仓库已经补好 GitHub Pages 发布工作流。你只需要在 GitHub 仓库中完成一次设置：

1. 打开仓库 `Settings -> Pages`
2. 在 `Build and deployment` 中把 `Source` 切换为 `GitHub Actions`
3. 后续推送到 `main` 分支时会自动构建并发布

当前仓库的 Pages 地址应为：

```text
https://chenlicool.github.io/Hue-Forge/
```

## 开源说明

- 本项目当前按 `MIT License` 开源
- 仓库地址：[chenlicool/Hue-Forge](https://github.com/chenlicool/Hue-Forge)
- 许可证全文见仓库根目录 [LICENSE](https://github.com/chenlicool/Hue-Forge/blob/main/LICENSE)
- 若你使用第三方 API 或自行扩展外部服务，对应服务条款与费用不包含在本项目开源许可证内

## 使用流程

1. 在顶部工具栏选择或新增 hue 集合
2. 在左侧 `Base` 轨道调整整体亮度基线
3. 选中某个色条或 step，微调饱和度与亮度曲线
4. 观察右侧对比度反馈，确认文字可读性
5. 在导出面板复制对应格式，直接用于代码库或 AI 工作流

## 导出示例

Hue Forge 会基于当前画面中的 palette 直接生成导出结果，而不是维护另一套脱节的 token 状态。典型输出如下：

```css
:root {
  --blue-10: #f3f8ff;
  --blue-20: #dbeafe;
  --blue-30: #bfdbfe;
  --blue-40: #93c5fd;
}
```

```js
export default {
  theme: {
    extend: {
      colors: {
        blue: {
          10: "#f3f8ff",
          20: "#dbeafe",
          30: "#bfdbfe",
          40: "#93c5fd"
        }
      }
    }
  }
}
```

## 目录结构

- `src/`：前端源码
- `scripts/`：辅助脚本；当前包含颜色对比度检查脚本
- `archive/`：历史备份与遗留配置归档
- `ARCHITECTURE.md`：技术架构与核心流程说明
- `CHANGELOG.md`：版本变更记录

## 环境依赖

- Node.js 18+（更低版本兼容性待确认/未知）
- npm

## 当前状态

- 已完成根目录工程整理并推送到 GitHub
- 已补齐 GitHub Pages 发布配置；仓库设置中的 `Pages -> Source` 仍需手动切到 `GitHub Actions`
- 已补齐 `MIT` 许可证与页面内开源入口
- 已将内部协作与规划文档改为本地保留，不再作为公开仓库内容分发
- 当前构建可通过，但生产包体积存在告警，后续可继续做 chunk 拆分
- `archive/metadata.json` 是否仍需长期保留，待确认/未知

---

# Hue Forge (English)

![Hue Forge Cover](docs/cover.svg)

Hue Forge is a color system generator for design systems and brand palette work. It uses HSB curve models and WCAG contrast rules to help you generate, tune, validate, and export production-ready color scales.

## Project Positioning

- Built for design and frontend workflows that need multi-hue, multi-step palette generation
- Brings color generation, readability checks, and code export into one local frontend tool
- Currently implemented as a pure frontend single-page app with no backend dependency

## Core Capabilities

- Generate multi-hue palette matrices with aligned step structures
- Adjust the `Base Scale` plus per-strip saturation and brightness curves
- Review black-on-color and white-on-color contrast with WCAG grades
- Export `CSS`, `Tailwind`, `Tailwind 4`, and `Tokens`
- Support `AI Export` for copying structured, AI-ready context text

## Quick Start

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Open `http://localhost:3000`

## Common Commands

```bash
npm run dev
npm run build
npm run lint
npm run check:contrast
```

## GitHub Pages Deployment

This repository already includes a GitHub Pages workflow. You only need one repository setting:

1. Open `Settings -> Pages`
2. Set `Source` to `GitHub Actions`
3. Every push to `main` will then build and deploy automatically

Expected site URL:

```text
https://chenlicool.github.io/Hue-Forge/
```

## Open Source

- This project is currently released under the `MIT License`
- Repository: [chenlicool/Hue-Forge](https://github.com/chenlicool/Hue-Forge)
- License text: [LICENSE](https://github.com/chenlicool/Hue-Forge/blob/main/LICENSE)
- If you connect third-party APIs or external services, their terms and costs are not covered by this repository license

## Workflow

1. Choose or add a hue set from the top toolbar
2. Adjust the overall brightness baseline from the left `Base` rail
3. Select a strip or step and fine-tune saturation and brightness curves
4. Use the contrast feedback panel to verify readability
5. Copy the exported format for direct use in codebases or AI workflows

## Export Example

Hue Forge exports directly from the current palette view instead of maintaining a separate token state. A typical output looks like this:

```css
:root {
  --blue-10: #f3f8ff;
  --blue-20: #dbeafe;
  --blue-30: #bfdbfe;
  --blue-40: #93c5fd;
}
```

```js
export default {
  theme: {
    extend: {
      colors: {
        blue: {
          10: "#f3f8ff",
          20: "#dbeafe",
          30: "#bfdbfe",
          40: "#93c5fd"
        }
      }
    }
  }
}
```

## Repository Structure

- `src/`: frontend source code
- `scripts/`: helper scripts, currently including the contrast check script
- `archive/`: archived backups and legacy files
- `ARCHITECTURE.md`: technical architecture and core flow notes
- `CHANGELOG.md`: version change history

## Environment

- Node.js 18+ (compatibility with lower versions: pending/unknown)
- npm

## Current Status

- The repository has been cleaned up and pushed to GitHub
- GitHub Pages deployment is configured; `Pages -> Source` must be set to `GitHub Actions`
- The `MIT` license and in-app open-source entry points are already in place
- Internal collaboration and planning docs are kept locally and are no longer distributed in the public repository
- The current build passes, but the production bundle still has a size warning that can be optimized later
- Whether `archive/metadata.json` should be kept long-term is still pending/unknown
