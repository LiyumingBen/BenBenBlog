---
title: Git管理规范
date: 2023-07-14 16:02:42
permalink: /pages/e37b334153c56/
categories:
  - 前端规范
tags:
  - git规范
---
# 基础平台内部分支管理规范，请务必按此规范进行开发

<a name="N9i3N"></a>

## GitFlow 流程规范

<a name="91be7c16"></a>

### 开发分支（develop）‌

develop 分支是仓库的开发分支，这个分支包含最近发布到开发环境的代码。
<a name="l7YDS"></a>

### 预发布分支（release）‌

release 分支是仓库的预发布分支（测试），用于 QA 测试。从 develop 拉取，测试完成 merge 到 master 和 develop，如果测试期间，有其他版本合并入 master，需要同步到 release 版本，并进行测试。
<a name="fCijc"></a>

### 生产分支（master）‌

master 分支是仓库的生产分支，这个分支包含最近发布到生产环境的代码， 这个分支需从 release 分支合并，禁止在这个分支直接修改 ‌。

## 使用

<a name="O4O6V"></a>

### 新功能开发(feature)

- 做新功能的时从 develop 拉取分支, 多人开发同一个功能模块时，只需拉取一个分支：

       feature-'作者'-'功能概括名'-'时间'（feature-liyuming-weather-20223/02/16）

- 自测无误后提交 merge 到 develop，稳定后删除自己的 feature 分支;
  <a name="bf65c"></a>

### 线上问题修复(hotfix)

- 修复线上环境上的问题从 master 拉取分支:

       hotfix-'作者'-bug概括名'-'时间'（hotfix-liyuming-weather-20223/02/16）

- 自测无误后提交 merge 到 master 和 develop，如果修复期间，有其他版本合并入 master ，需要同步到 hotfix 版本，并进行测试。 然后稳定后删除自己的 hotfix 分支;

<a name="x4wX7"></a>

## 提交规范

<a name="Z8mgi"></a>

### （1）type

    提交 commit 的类型，包括以下几种：
    feat: 新功能
    fix: 修复问题
    docs: 修改文档
    style: 修改代码格式，不影响代码逻辑
    refactor: 重构代码，理论上不影响现有功能
    perf: 提升性能
    test: 增加修改测试用例
    chore: 修改工具相关（包括但不限于文档、代码生成等）
    revert: 代码回滚
    ci： 工程构建

<a name="M9dXV"></a>

### （2）scope

    修改文件的范围（包括但不限于 doc, middleware, proxy, core, config）

<a name="nwOXH"></a>

### （3）subject

    用一句话清楚的描述这次提交做了什么

<a name="EsC83"></a>

### （4）body

    补充 subject，适当增加原因、目的等相关因素，也可不写。

<a name="FqN6C"></a>

### （5）footer

    当有非兼容修改时可在这里描述清楚
    关联相关 issue，如 Closes #1, Closes #2, #3
