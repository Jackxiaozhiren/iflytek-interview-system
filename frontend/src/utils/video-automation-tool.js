#!/usr/bin/env node

/**
 * iFlytek Spark视频自动化生成工具
 * Automated Video Generation Tool for iFlytek Spark Interview System
 * 
 * 整合现有的enhanced-chinese-video-generator.js和新的complete-video-generator.js
 * Integrates existing enhanced-chinese-video-generator.js with new complete-video-generator.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateCompleteVideo, COMPLETE_VIDEO_CONFIGS } from './complete-video-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 视频生成状态管理
class VideoGenerationManager {
    constructor() {
        this.projectRoot = path.resolve(__dirname, '../..');
        this.outputDir = path.join(this.projectRoot, 'generated-videos');
        this.tasksFile = path.join(this.projectRoot, 'video-generation-tasks.json');
        this.ensureDirectories();
    }

    ensureDirectories() {
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    // 显示可用的视频配置
    listAvailableVideos() {
        console.log('🎬 iFlytek Spark可生成的演示视频:\n');
        
        COMPLETE_VIDEO_CONFIGS.forEach((config, index) => {
            console.log(`${index + 1}. ${config.title}`);
            console.log(`   ID: ${config.id}`);
            console.log(`   时长: ${Math.floor(config.duration/60)}分${config.duration%60}秒`);
            console.log(`   场景数: ${config.scenes.length}`);
            console.log(`   分辨率: ${config.resolution} @ ${config.fps}fps`);
            console.log('');
        });
    }

    // 生成单个视频
    async generateSingleVideo(videoId) {
        console.log(`🚀 开始生成视频: ${videoId}\n`);
        
        try {
            const taskInfo = await generateCompleteVideo(videoId);
            
            // 保存到统一的任务管理文件
            this.saveTaskInfo(videoId, taskInfo);
            
            console.log(`\n✅ 视频 "${videoId}" 生成任务已启动`);
            console.log(`📁 输出目录: ${this.outputDir}`);
            console.log(`📄 任务文件: ${this.tasksFile}`);
            
            return taskInfo;
            
        } catch (error) {
            console.error(`❌ 视频生成失败:`, error.message);
            throw error;
        }
    }

    // 批量生成所有视频
    async generateAllVideos() {
        console.log('🎬 开始批量生成所有iFlytek Spark演示视频\n');
        
        const allTasks = {};
        
        for (const config of COMPLETE_VIDEO_CONFIGS) {
            console.log(`\n📹 正在处理: ${config.title} (${config.id})`);
            
            try {
                const taskInfo = await this.generateSingleVideo(config.id);
                allTasks[config.id] = taskInfo;
                
                // 避免API限流
                console.log('⏳ 等待2分钟后处理下一个视频...');
                await new Promise(resolve => setTimeout(resolve, 120000));
                
            } catch (error) {
                console.error(`❌ 视频 ${config.id} 生成失败:`, error.message);
                allTasks[config.id] = { error: error.message, status: 'failed' };
            }
        }
        
        // 保存批量任务信息
        const batchTaskInfo = {
            batch_id: `batch_${Date.now()}`,
            generated_at: new Date().toISOString(),
            total_videos: COMPLETE_VIDEO_CONFIGS.length,
            successful_tasks: Object.values(allTasks).filter(t => t.status !== 'failed').length,
            failed_tasks: Object.values(allTasks).filter(t => t.status === 'failed').length,
            tasks: allTasks
        };
        
        fs.writeFileSync(
            path.join(this.outputDir, 'batch-generation-summary.json'),
            JSON.stringify(batchTaskInfo, null, 2)
        );
        
        console.log('\n📊 批量生成完成统计:');
        console.log(`   总视频数: ${batchTaskInfo.total_videos}`);
        console.log(`   成功: ${batchTaskInfo.successful_tasks}`);
        console.log(`   失败: ${batchTaskInfo.failed_tasks}`);
        console.log(`   成功率: ${Math.round((batchTaskInfo.successful_tasks / batchTaskInfo.total_videos) * 100)}%`);
        
        return batchTaskInfo;
    }

    // 检查生成状态
    checkGenerationStatus(videoId = null) {
        console.log('🔍 检查视频生成状态\n');
        
        if (!fs.existsSync(this.tasksFile)) {
            console.log('❌ 未找到任务记录文件');
            console.log('请先运行视频生成命令');
            return;
        }
        
        const allTasks = JSON.parse(fs.readFileSync(this.tasksFile, 'utf8'));
        
        if (videoId) {
            // 检查特定视频状态
            if (allTasks[videoId]) {
                this.displayVideoStatus(videoId, allTasks[videoId]);
            } else {
                console.log(`❌ 未找到视频 "${videoId}" 的任务记录`);
            }
        } else {
            // 检查所有视频状态
            console.log('📋 所有视频生成状态:\n');
            Object.entries(allTasks).forEach(([id, task]) => {
                this.displayVideoStatus(id, task);
                console.log('');
            });
        }
    }

    displayVideoStatus(videoId, taskInfo) {
        const config = COMPLETE_VIDEO_CONFIGS.find(c => c.id === videoId);
        const title = config ? config.title : videoId;
        
        console.log(`📹 ${title} (${videoId})`);
        console.log(`   状态: ${taskInfo.status || '未知'}`);
        console.log(`   创建时间: ${taskInfo.generation_timestamp || '未知'}`);
        
        if (taskInfo.tasks) {
            console.log(`   图片任务: ${taskInfo.tasks.images?.length || 0} 个`);
            console.log(`   视频任务: ${taskInfo.tasks.videos?.length || 0} 个`);
            console.log(`   语音任务: ${taskInfo.tasks.voiceovers?.length || 0} 个`);
        }
        
        if (taskInfo.estimated_completion) {
            const completionTime = new Date(taskInfo.estimated_completion);
            const now = new Date();
            const isCompleted = now > completionTime;
            
            console.log(`   预计完成: ${completionTime.toLocaleString()}`);
            console.log(`   状态: ${isCompleted ? '✅ 应该已完成' : '⏳ 生成中'}`);
        }
        
        if (taskInfo.error) {
            console.log(`   错误: ${taskInfo.error}`);
        }
    }

    // 保存任务信息
    saveTaskInfo(videoId, taskInfo) {
        let allTasks = {};
        
        if (fs.existsSync(this.tasksFile)) {
            allTasks = JSON.parse(fs.readFileSync(this.tasksFile, 'utf8'));
        }
        
        allTasks[videoId] = taskInfo;
        fs.writeFileSync(this.tasksFile, JSON.stringify(allTasks, null, 2));
    }

    // 清理任务记录
    cleanupTasks() {
        if (fs.existsSync(this.tasksFile)) {
            fs.unlinkSync(this.tasksFile);
            console.log('✅ 任务记录已清理');
        }
        
        // 清理输出目录中的临时文件
        const tempFiles = fs.readdirSync(this.outputDir).filter(file => 
            file.endsWith('_generation_tasks.json') || file.startsWith('step1-')
        );
        
        tempFiles.forEach(file => {
            fs.unlinkSync(path.join(this.outputDir, file));
        });
        
        console.log(`✅ 清理了 ${tempFiles.length} 个临时文件`);
    }

    // 显示帮助信息
    showHelp() {
        console.log('🎬 iFlytek Spark视频自动化生成工具\n');
        console.log('用法:');
        console.log('  node video-automation-tool.js [命令] [参数]\n');
        console.log('命令:');
        console.log('  list                    - 显示可生成的视频列表');
        console.log('  generate <video-id>     - 生成指定视频');
        console.log('  generate-all           - 批量生成所有视频');
        console.log('  status [video-id]      - 检查生成状态');
        console.log('  cleanup                - 清理任务记录');
        console.log('  help                   - 显示帮助信息\n');
        console.log('示例:');
        console.log('  node video-automation-tool.js list');
        console.log('  node video-automation-tool.js generate demo-complete');
        console.log('  node video-automation-tool.js generate-all');
        console.log('  node video-automation-tool.js status demo-complete');
        console.log('  node video-automation-tool.js cleanup\n');
        console.log('可用的视频ID:');
        COMPLETE_VIDEO_CONFIGS.forEach(config => {
            console.log(`  - ${config.id}: ${config.title}`);
        });
    }
}

// 主程序
async function main() {
    const manager = new VideoGenerationManager();
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args[0] === 'help') {
        manager.showHelp();
        return;
    }
    
    const command = args[0];
    
    try {
        switch (command) {
            case 'list':
                manager.listAvailableVideos();
                break;
                
            case 'generate':
                const videoId = args[1];
                if (!videoId) {
                    console.log('❌ 请指定视频ID');
                    console.log('使用 "node video-automation-tool.js list" 查看可用视频');
                    return;
                }
                await manager.generateSingleVideo(videoId);
                break;
                
            case 'generate-all':
                await manager.generateAllVideos();
                break;
                
            case 'status':
                const statusVideoId = args[1];
                manager.checkGenerationStatus(statusVideoId);
                break;
                
            case 'cleanup':
                manager.cleanupTasks();
                break;
                
            default:
                console.log(`❌ 未知命令: ${command}`);
                manager.showHelp();
        }
    } catch (error) {
        console.error('❌ 执行失败:', error.message);
        process.exit(1);
    }
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { VideoGenerationManager };
