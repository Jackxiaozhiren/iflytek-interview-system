// 应用程序诊断检查脚本
const fs = require('fs')
const path = require('path')

console.log('🔍 开始应用程序诊断检查...')

// 检查1: 基础依赖
console.log('\n📦 检查基础依赖...')
try {
  
  // 检查package.json
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
  console.log('✅ package.json 读取成功')
  console.log('📋 项目名称:', packageJson.name)
  console.log('📋 项目版本:', packageJson.version)
  
  // 检查关键依赖
  const keyDeps = ['vue', 'element-plus', 'vue-router', 'vite']
  keyDeps.forEach(dep => {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep] || packageJson.devDependencies[dep]}`)
    } else {
      console.log(`❌ ${dep}: 未找到`)
    }
  })
  
} catch (error) {
  console.log('❌ package.json 检查失败:', error.message)
}

// 检查2: 核心文件存在性
console.log('\n📁 检查核心文件...')
const coreFiles = [
  './src/main.js',
  './src/App.vue',
  './src/router/index.js',
  './src/views/HomePage.vue',
  './index.html',
  './vite.config.js'
]

coreFiles.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`)
    } else {
      console.log(`❌ ${file} - 文件不存在`)
    }
  } catch (error) {
    console.log(`❌ ${file} - 检查失败: ${error.message}`)
  }
})

// 检查3: node_modules
console.log('\n📚 检查node_modules...')
try {
  if (fs.existsSync('./node_modules')) {
    console.log('✅ node_modules 目录存在')
    
    // 检查关键模块
    const keyModules = ['vue', 'element-plus', 'vue-router', 'vite']
    keyModules.forEach(module => {
      if (fs.existsSync(`./node_modules/${module}`)) {
        console.log(`✅ ${module} 模块已安装`)
      } else {
        console.log(`❌ ${module} 模块未安装`)
      }
    })
  } else {
    console.log('❌ node_modules 目录不存在 - 请运行 npm install')
  }
} catch (error) {
  console.log('❌ node_modules 检查失败:', error.message)
}

// 检查4: 样式文件
console.log('\n🎨 检查样式文件...')
const styleFiles = [
  './src/styles/design-system.css',
  './src/styles/iflytek-brand.css',
  './src/styles/components.css'
]

styleFiles.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`)
    } else {
      console.log(`⚠️ ${file} - 样式文件不存在`)
    }
  } catch (error) {
    console.log(`❌ ${file} - 检查失败: ${error.message}`)
  }
})

console.log('\n🔍 诊断检查完成!')
console.log('\n💡 建议的故障排除步骤:')
console.log('1. 如果有依赖问题，运行: npm install')
console.log('2. 如果有缓存问题，运行: npm run build')
console.log('3. 检查浏览器控制台是否有JavaScript错误')
console.log('4. 检查网络面板是否有资源加载失败')
console.log('5. 尝试硬刷新浏览器 (Ctrl+F5 或 Cmd+Shift+R)')
