#!/bin/bash

# ============================================
# Admin Web Staging 环境一键部署脚本（改进版）
# ============================================

set -euo pipefail  # 添加 -u (未定义变量报错) 和 -o pipefail (管道中任何命令失败都报错)

# 加载配置和工具函数
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/config.sh"
source "${SCRIPT_DIR}/utils.sh"

# ============================================
# 清理函数（失败时回滚）
# ============================================

cleanup_on_error() {
    local exit_code=$?
    if [ $exit_code -ne 0 ]; then
        log_error "部署失败（退出码: ${exit_code}），开始回滚..."

        if [ -n "${OLD_IMAGE_ID:-}" ]; then
            log_step "恢复旧镜像"
            docker tag "${OLD_IMAGE_ID}" linux-190-deploy_frontend:latest 2>/dev/null || true
            docker-compose up -d --no-build 2>/dev/null || true
        fi
    fi
}

trap cleanup_on_error EXIT

# ============================================
# 主函数
# ============================================

main() {
    print_header "Admin Web Staging 环境一键部署"

    log_info "此脚本将执行以下操作："
    echo "  1. 拉取最新代码（main 分支）"
    echo "  2. 构建前端项目"
    echo "  3. 停止旧容器"
    echo "  4. 构建并启动新容器"
    echo "  5. 健康检查"
    echo ""

    # 确认提示
    if [ "${AUTO_CONFIRM}" != "true" ]; then
        log_warning "确定要继续吗？ [y/N]"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            log_info "操作已取消"
            exit 0
        fi
    fi

    log_info "开始部署..."
    echo ""

    # 步骤 1: 拉取代码
    print_step "步骤 1/5: 拉取最新代码"
    cd "${PROJECT_ROOT}"

    # 检查是否有未提交的修改
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        log_warning "检测到未提交的本地修改"
        if [ "${AUTO_CONFIRM}" != "true" ]; then
            log_warning "是否继续？这将丢弃本地修改 [y/N]"
            read -r response
            if [[ ! "$response" =~ ^[Yy]$ ]]; then
                log_info "操作已取消"
                exit 0
            fi
        fi
        git reset --hard HEAD
    fi

    log_step "切换到 ${GIT_BRANCH} 分支"
    git fetch origin
    git checkout "${GIT_BRANCH}"

    # 记录当前 commit，用于验证
    local old_commit=$(git rev-parse HEAD)
    git pull origin "${GIT_BRANCH}"
    local new_commit=$(git rev-parse HEAD)

    if [ "${old_commit}" = "${new_commit}" ]; then
        log_info "代码已是最新（${new_commit:0:8}）"
    else
        log_success "代码更新完成（${old_commit:0:8} -> ${new_commit:0:8}）"
    fi
    echo ""

    # 步骤 2: 构建前端
    print_step "步骤 2/5: 构建前端项目"
    log_step "执行 npm run build:staging"
    npm run build:staging
    log_success "前端构建完成"
    echo ""

    # 步骤 3: 停止旧容器并备份镜像
    print_step "步骤 3/5: 停止旧容器"
    cd "${DEPLOY_DIR}"

    # 精确匹配容器名
    if docker ps -a --filter "name=^${CONTAINER_NAME}$" --format "{{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        log_step "备份当前镜像"
        OLD_IMAGE_ID=$(docker inspect --format='{{.Image}}' "${CONTAINER_NAME}" 2>/dev/null || echo "")
        if [ -n "${OLD_IMAGE_ID}" ]; then
            docker tag "${OLD_IMAGE_ID}" "linux-190-deploy_frontend:backup-$(date +%Y%m%d-%H%M%S)" || true
            log_success "镜像已备份"
        fi

        log_step "停止并删除旧容器"
        docker-compose down
        log_success "旧容器已清理"
    else
        log_info "没有运行中的容器"
    fi

    # 清理悬空镜像（dangling images）
    log_step "清理悬空镜像"
    docker image prune -f >/dev/null 2>&1 || true
    echo ""

    # 步骤 4: 启动新容器
    print_step "步骤 4/5: 构建并启动新容器"
    log_step "构建并启动容器"

    # 使用 --remove-orphans 清理孤立容器
    if ! docker-compose up -d --build --force-recreate --remove-orphans; then
        log_error "容器启动失败"
        exit 1
    fi

    log_success "容器启动完成"
    echo ""

    # 步骤 5: 健康检查
    print_step "步骤 5/5: 健康检查"

    # 等待容器启动
    sleep 3

    # 检查容器是否在运行
    if ! docker ps --filter "name=^${CONTAINER_NAME}$" --format "{{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        log_error "容器未运行"
        docker logs "${CONTAINER_NAME}" --tail 50
        exit 1
    fi

    if wait_for_healthy "${CONTAINER_NAME}" "${HEALTH_CHECK_TIMEOUT}"; then
        log_success "健康检查通过"
    else
        log_error "健康检查失败"
        log_step "容器日志（最后50行）："
        docker logs "${CONTAINER_NAME}" --tail 50
        exit 1
    fi
    echo ""

    # 显示容器状态
    log_step "容器状态"
    docker-compose ps
    echo ""

    # 清理旧备份镜像（保留最近3个）
    log_step "清理旧备份镜像"
    docker images --filter "reference=linux-190-deploy_frontend:backup-*" --format "{{.ID}} {{.CreatedAt}}" | \
        sort -k2 -r | tail -n +4 | awk '{print $1}' | xargs -r docker rmi -f 2>/dev/null || true

    # 部署完成
    print_header "✅ 部署完成！"

    log_info "访问地址："
    echo "  - 前端页面: https://app.wenlong.life/admin"
    echo "  - 后端 API: https://app.wenlong.life/api/v1"
    echo ""

    log_info "查看日志："
    echo "  docker logs ${CONTAINER_NAME} -f"
    echo ""

    log_info "回滚到上一版本："
    echo "  docker tag linux-190-deploy_frontend:backup-<timestamp> linux-190-deploy_frontend:latest"
    echo "  docker-compose up -d --no-build"
    echo ""
}

# 执行主函数
main "$@"
