<h1 align="center">oh-my-githubcopilot (OMG)</h1>

<p align="center">
  <strong>Multi-agent orchestration for GitHub Copilot. Supercharged productivity.</strong>
</p>

<p align="center">
  <a href="#english">English</a> | <a href="#한국어">한국어</a> | <a href="#中文">中文</a> | <a href="#日本語">日本語</a> | <a href="#español">Español</a>
</p>

<p align="center">
  <a href="https://github.com/jmstar85/oh-my-githubcopilot"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License: MIT"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=jmstar85.oh-my-githubcopilot"><img src="https://img.shields.io/visual-studio-marketplace/v/jmstar85.oh-my-githubcopilot" alt="Marketplace Version"></a>
</p>

---

<h2 id="english">🇺🇸 English</h2>

**oh-my-githubcopilot (OMG)** brings multi-agent orchestration to GitHub Copilot — coordinating 20 specialized agents and 18 reusable skills through an MCP server, giving you structured workflows for planning, execution, review, and verification inside VS Code.

> This project is inspired by the multi-agent orchestration approach of [oh-my-claudecode (OMC)](https://github.com/yeachan-heo/oh-my-claudecode), and is implemented independently for GitHub Copilot.

### Getting Started

1. Install this extension from the VS Code Marketplace
2. Open any workspace
3. Run `OMG: Initialize Workspace` from the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
4. Start using skills in GitHub Copilot Chat

### Commands

| Command | Description |
|---------|-------------|
| `OMG: Initialize Workspace` | Scaffold all OMG files into your workspace (run this first!) |
| `OMG: Update Convention Files` | Update to the latest bundled agents, skills, and hooks |
| `OMG: Run Health Check` | Validate files, MCP server build, and version drift |
| `OMG: Show Workflow Status` | Display currently active OMG workflows |
| `OMG: Clear Workflow State` | Remove all `.omc/state/*-state.json` files |

### Workflow Skills & Trigger Keywords

| Skill | Trigger Keywords | What It Does |
|-------|-----------------|-------------|
| `/omg-autopilot` | `omg-autopilot`, `build me`, `create me` | Full autonomous execution from idea to working code |
| `/ralph` | `ralph`, `don't stop`, `finish this` | PRD-driven loop — won't stop until verified complete |
| `/ultrawork` | `ulw`, `ultrawork`, `parallel` | Parallel execution engine for high-throughput tasks |
| `/ralplan` | `ralplan`, `consensus plan` | Planner → Architect → Critic consensus planning loop |
| `/plan` | `plan this`, `let's plan` | Structured planning with optional interview workflow |
| `/team` | `team`, `multi-agent`, `swarm` | N coordinated agents on a shared task list |
| `/deep-interview` | `deep interview`, `ask me everything` | Socratic requirements clarification |
| `/trace` | `trace this`, `root cause analysis` | Evidence-driven causal tracing |
| `/review` | `review this`, `code review` | Code review with severity ratings |
| `/ultraqa` | `ultraqa`, `fix all tests` | QA cycling — test, verify, fix, repeat |
| `/verify` | `verify this`, `prove it works` | Evidence-based completion verification |
| `/ai-slop-cleaner` | `deslop`, `anti-slop`, `cleanup slop` | Fix AI-generated code smells |
| `/self-improve` | `self-improve`, `evolve code` | Evolutionary code improvement |
| `/status` | `status`, `what's running` | Show current workflow status |
| `/cancel` | `cancel`, `stop`, `abort` | Cancel active execution modes |
| `/remember` | `remember this`, `store this` | Save information to project memory |

### Specialized Agents (20)

`@omg-coordinator` `@executor` `@architect` `@planner` `@analyst` `@debugger` `@verifier` `@code-reviewer` `@security-reviewer` `@critic` `@test-engineer` `@designer` `@writer` `@tracer` `@scientist` `@qa-tester` `@git-master` `@code-simplifier` `@explore` `@document-specialist`

### Requirements

- VS Code ≥ 1.96.0
- Node.js ≥ 18
- GitHub Copilot extension installed and active

---

<h2 id="한국어">🇰🇷 한국어</h2>

**oh-my-githubcopilot (OMG)** 은 GitHub Copilot에 멀티 에이전트 오케스트레이션을 제공합니다. 20개의 전문 에이전트와 18개의 재사용 가능한 스킬을 MCP 서버로 조율하여 VS Code 내에서 기획, 실행, 검토, 검증까지 구조화된 워크플로우를 지원합니다.

### 시작하기

1. VS Code 마켓플레이스에서 이 확장 설치
2. 아무 워크스페이스나 열기
3. `Cmd+Shift+P` → `OMG: Initialize Workspace` 실행 (**필수!**)
4. GitHub Copilot Chat에서 스킬 사용 시작

### 명령어

| 명령어 | 설명 |
|--------|------|
| `OMG: Initialize Workspace` | 워크스페이스에 모든 OMG 파일 설치 (처음 한 번 실행 필수!) |
| `OMG: Update Convention Files` | 에이전트, 스킬, 훅을 최신 버전으로 업데이트 |
| `OMG: Run Health Check` | 파일 존재 여부, MCP 서버 빌드 상태, 버전 드리프트 검사 |
| `OMG: Show Workflow Status` | 현재 활성 워크플로우 표시 |
| `OMG: Clear Workflow State` | 워크플로우 상태 파일 초기화 |

### 스킬 및 트리거 키워드

| 스킬 | 트리거 키워드 | 설명 |
|------|-------------|------|
| `/omg-autopilot` | `omg-autopilot`, `build me`, `create me` | 아이디어에서 동작하는 코드까지 완전 자율 실행 |
| `/ralph` | `ralph`, `don't stop`, `finish this` | PRD 기반 루프 — 완료 검증까지 멈추지 않음 |
| `/ultrawork` | `ulw`, `ultrawork`, `parallel` | 고속 병렬 실행 엔진 |
| `/ralplan` | `ralplan`, `consensus plan` | 플래너→아키텍트→크리틱 합의 계획 루프 |
| `/plan` | `plan this`, `let's plan` | 인터뷰 워크플로우와 함께하는 구조적 계획 |
| `/team` | `team`, `multi-agent`, `swarm` | 공유 작업 목록의 N개 조율 에이전트 |
| `/deep-interview` | `deep interview`, `ask me everything` | 소크라테스식 요구사항 명확화 |
| `/trace` | `trace this`, `root cause analysis` | 증거 기반 인과 추적 |
| `/review` | `review this`, `code review` | 심각도 등급이 있는 코드 리뷰 |
| `/ultraqa` | `ultraqa`, `fix all tests` | QA 사이클 — 테스트, 검증, 수정 반복 |
| `/verify` | `verify this`, `prove it works` | 증거 기반 완료 검증 |
| `/status` | `status`, `what's running` | 현재 워크플로우 상태 표시 |
| `/cancel` | `cancel`, `stop`, `abort` | 활성 실행 모드 취소 |

### 요구사항

- VS Code ≥ 1.96.0
- Node.js ≥ 18
- GitHub Copilot 확장 설치 및 활성화 필요

---

<h2 id="中文">🇨🇳 中文</h2>

**oh-my-githubcopilot (OMG)** 为 GitHub Copilot 带来多智能体编排能力。通过 MCP 服务器协调 20 个专业智能体和 18 个可复用技能，在 VS Code 内提供规划、执行、审查和验证的结构化工作流。

### 快速开始

1. 从 VS Code 扩展市场安装此扩展
2. 打开任意工作区
3. `Cmd+Shift+P` → 运行 `OMG: Initialize Workspace`（**必须执行！**）
4. 在 GitHub Copilot Chat 中开始使用技能

### 命令

| 命令 | 说明 |
|------|------|
| `OMG: Initialize Workspace` | 将所有 OMG 文件安装到工作区（首次必须运行！） |
| `OMG: Update Convention Files` | 更新智能体、技能和钩子至最新版本 |
| `OMG: Run Health Check` | 检查文件、MCP 服务器构建状态和版本漂移 |
| `OMG: Show Workflow Status` | 显示当前活动的工作流 |
| `OMG: Clear Workflow State` | 清除所有工作流状态文件 |

### 技能与触发关键词

| 技能 | 触发关键词 | 说明 |
|------|-----------|------|
| `/omg-autopilot` | `omg-autopilot`、`build me`、`create me` | 从想法到可运行代码的完全自主执行 |
| `/ralph` | `ralph`、`don't stop`、`finish this` | PRD 驱动循环——直到验证完成才停止 |
| `/ultrawork` | `ulw`、`ultrawork`、`parallel` | 高吞吐量并行执行引擎 |
| `/ralplan` | `ralplan`、`consensus plan` | 规划师→架构师→评论家共识规划循环 |
| `/plan` | `plan this`、`let's plan` | 带可选访谈工作流的结构化规划 |
| `/team` | `team`、`multi-agent`、`swarm` | 共享任务列表上的 N 个协调智能体 |
| `/deep-interview` | `deep interview`、`ask me everything` | 苏格拉底式需求澄清 |
| `/trace` | `trace this`、`root cause analysis` | 基于证据的因果追溯 |
| `/review` | `review this`、`code review` | 带严重性评级的代码审查 |
| `/ultraqa` | `ultraqa`、`fix all tests` | QA 循环——测试、验证、修复，反复进行 |
| `/status` | `status`、`what's running` | 显示当前工作流状态 |
| `/cancel` | `cancel`、`stop`、`abort` | 取消活动执行模式 |

### 要求

- VS Code ≥ 1.96.0
- Node.js ≥ 18
- 需要安装并激活 GitHub Copilot 扩展

---

<h2 id="日本語">🇯🇵 日本語</h2>

**oh-my-githubcopilot (OMG)** は GitHub Copilot にマルチエージェントオーケストレーションをもたらします。MCP サーバーを通じて 20 の専門エージェントと 18 の再利用可能なスキルを調整し、VS Code 内で計画、実行、レビュー、検証のための構造化されたワークフローを提供します。

### はじめに

1. VS Code マーケットプレイスからこの拡張機能をインストール
2. 任意のワークスペースを開く
3. `Cmd+Shift+P` → `OMG: Initialize Workspace` を実行（**必須！**）
4. GitHub Copilot Chat でスキルを使い始める

### コマンド

| コマンド | 説明 |
|---------|------|
| `OMG: Initialize Workspace` | すべての OMG ファイルをワークスペースにインストール（最初に実行必須！） |
| `OMG: Update Convention Files` | エージェント、スキル、フックを最新版に更新 |
| `OMG: Run Health Check` | ファイル、MCP サーバービルド、バージョンドリフトを検証 |
| `OMG: Show Workflow Status` | 現在アクティブなワークフローを表示 |
| `OMG: Clear Workflow State` | すべてのワークフロー状態ファイルをクリア |

### スキルとトリガーキーワード

| スキル | トリガーキーワード | 説明 |
|-------|-----------------|------|
| `/omg-autopilot` | `omg-autopilot`、`build me`、`create me` | アイデアから動くコードまでの完全自律実行 |
| `/ralph` | `ralph`、`don't stop`、`finish this` | PRD 駆動ループ——検証完了まで止まらない |
| `/ultrawork` | `ulw`、`ultrawork`、`parallel` | 高スループット並列実行エンジン |
| `/ralplan` | `ralplan`、`consensus plan` | プランナー→アーキテクト→クリティック合意計画ループ |
| `/plan` | `plan this`、`let's plan` | インタビューワークフロー付き構造化計画 |
| `/team` | `team`、`multi-agent`、`swarm` | 共有タスクリスト上の N 個の調整エージェント |
| `/deep-interview` | `deep interview`、`ask me everything` | ソクラテス式要件明確化 |
| `/trace` | `trace this`、`root cause analysis` | 証拠駆動因果追跡 |
| `/review` | `review this`、`code review` | 重大度評価付きコードレビュー |
| `/ultraqa` | `ultraqa`、`fix all tests` | QA サイクル——テスト、検証、修正を繰り返す |
| `/status` | `status`、`what's running` | 現在のワークフロー状態を表示 |
| `/cancel` | `cancel`、`stop`、`abort` | アクティブな実行モードをキャンセル |

### 要件

- VS Code ≥ 1.96.0
- Node.js ≥ 18
- GitHub Copilot 拡張機能のインストールと有効化が必要

---

<h2 id="español">🇪🇸 Español</h2>

**oh-my-githubcopilot (OMG)** trae orquestación multi-agente a GitHub Copilot — coordinando 20 agentes especializados y 18 habilidades reutilizables a través de un servidor MCP, proporcionando flujos de trabajo estructurados para planificación, ejecución, revisión y verificación dentro de VS Code.

### Primeros pasos

1. Instala esta extensión desde el Marketplace de VS Code
2. Abre cualquier espacio de trabajo
3. `Cmd+Shift+P` → Ejecuta `OMG: Initialize Workspace` (**¡obligatorio!**)
4. Comienza a usar las habilidades en GitHub Copilot Chat

### Comandos

| Comando | Descripción |
|---------|-------------|
| `OMG: Initialize Workspace` | Instala todos los archivos OMG en tu espacio de trabajo (¡ejecutar primero!) |
| `OMG: Update Convention Files` | Actualiza agentes, habilidades y hooks a la última versión |
| `OMG: Run Health Check` | Valida archivos, build del servidor MCP y deriva de versiones |
| `OMG: Show Workflow Status` | Muestra los flujos de trabajo activos actualmente |
| `OMG: Clear Workflow State` | Elimina todos los archivos de estado de flujo de trabajo |

### Habilidades y palabras clave desencadenadoras

| Habilidad | Palabras clave | Descripción |
|-----------|---------------|-------------|
| `/omg-autopilot` | `omg-autopilot`, `build me`, `create me` | Ejecución autónoma completa desde idea hasta código funcional |
| `/ralph` | `ralph`, `don't stop`, `finish this` | Bucle impulsado por PRD — no se detiene hasta verificar completado |
| `/ultrawork` | `ulw`, `ultrawork`, `parallel` | Motor de ejecución paralela de alto rendimiento |
| `/ralplan` | `ralplan`, `consensus plan` | Bucle de planificación por consenso Planificador→Arquitecto→Crítico |
| `/plan` | `plan this`, `let's plan` | Planificación estructurada con flujo de entrevista opcional |
| `/team` | `team`, `multi-agent`, `swarm` | N agentes coordinados en una lista de tareas compartida |
| `/deep-interview` | `deep interview`, `ask me everything` | Clarificación de requisitos socrática |
| `/trace` | `trace this`, `root cause analysis` | Rastreo causal basado en evidencias |
| `/review` | `review this`, `code review` | Revisión de código con calificaciones de gravedad |
| `/ultraqa` | `ultraqa`, `fix all tests` | Ciclo QA — probar, verificar, corregir, repetir |
| `/status` | `status`, `what's running` | Mostrar estado actual del flujo de trabajo |
| `/cancel` | `cancel`, `stop`, `abort` | Cancelar modos de ejecución activos |

### Requisitos

- VS Code ≥ 1.96.0
- Node.js ≥ 18
- Extensión GitHub Copilot instalada y activa

---

## Architecture / 아키텍처 / 架构 / アーキテクチャ / Arquitectura

```
Install Extension → OMG: Initialize Workspace → .github/ files created
                                                        ↓
                              GitHub Copilot reads .github/copilot-instructions.md
                                                        ↓
                                    /ralplan, /omg-autopilot, @executor etc. work ✅
```

**The extension is the ignition key. The `.github/` convention files are the engine.**

---

## What's New

### v1.0.5 (2026-04-10)

- **Fix**: Renamed `/autopilot` skill to `/omg-autopilot` to resolve name collision with VS Code's built-in "Autopilot (Preview)" permission level
- **Fix**: Corrected invalid YAML frontmatter in all SKILL.md files (`allowed-tools` removed, `hint` → `argument-hint`)
- **Updated**: MCP server, agent definitions, cross-references, tests, and documentation

## License

MIT — [github.com/jmstar85/oh-my-githubcopilot](https://github.com/jmstar85/oh-my-githubcopilot)

## Legal Notice

Copyright (c) 2025-2026 oh-my-githubcopilot contributors.

OMG is an independent project for GitHub Copilot. It is inspired by OMC's orchestration model, but it is not a fork, clone, or affiliated product of OMC.
