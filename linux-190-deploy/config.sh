#!/bin/bash

# ============================================
# Admin Web Staging 环境配置
# ============================================

# 项目路径
export PROJECT_ROOT="/home/zwl/admin-web"
export DEPLOY_DIR="/home/zwl/admin-web/linux-190-deploy"

# Docker Compose 文件
export COMPOSE_FILE="${DEPLOY_DIR}/docker-compose.yml"

# 容器名称
export CONTAINER_NAME="admin-web-staging"

# 端口配置
export FRONTEND_PORT="8108"
export BACKEND_API_URL="http://23.94.103.190:8125"

# Git 配置
export GIT_BRANCH="main"

# 超时配置（秒）
export HEALTH_CHECK_TIMEOUT=60

# 自动确认（用于 CI/CD）
export AUTO_CONFIRM="${AUTO_CONFIRM:-false}"
