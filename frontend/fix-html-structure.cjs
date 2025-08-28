const fs = require('fs');

console.log('🔧 修复 TextPrimaryInterviewPage.vue 的HTML结构...\n');

// 读取文件
const filePath = 'src/views/TextPrimaryInterviewPage.vue';
let content = fs.readFileSync(filePath, 'utf8');

console.log('📄 原始文件行数:', content.split('\n').length);

// 提取template部分
const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
if (!templateMatch) {
  console.log('❌ 没有找到template标签');
  process.exit(1);
}

let template = templateMatch[1];
console.log('📝 Template部分提取成功');

// 检查并修复常见的HTML结构问题
console.log('\n🔍 检查HTML结构问题...');

// 1. 检查是否有未闭合的主要标签
const mainTags = ['main', 'section', 'div'];
const fixes = [];

mainTags.forEach(tag => {
  const openRegex = new RegExp(`<${tag}[^>]*(?<!/)>`, 'g');
  const closeRegex = new RegExp(`</${tag}>`, 'g');
  
  const openMatches = template.match(openRegex) || [];
  const closeMatches = template.match(closeRegex) || [];
  
  console.log(`${tag}: 开始${openMatches.length} / 结束${closeMatches.length}`);
  
  if (openMatches.length > closeMatches.length) {
    const missing = openMatches.length - closeMatches.length;
    fixes.push({ tag, missing });
  }
});

// 2. 如果发现问题，尝试修复
if (fixes.length > 0) {
  console.log('\n🛠️  发现需要修复的标签:');
  fixes.forEach(fix => {
    console.log(`- ${fix.tag}: 缺少 ${fix.missing} 个结束标签`);
  });
  
  // 在template结束前添加缺失的结束标签
  let additionalCloseTags = '';
  
  // 按照嵌套顺序添加结束标签
  fixes.reverse().forEach(fix => {
    for (let i = 0; i < fix.missing; i++) {
      additionalCloseTags += `    </${fix.tag}>\n`;
    }
  });
  
  if (additionalCloseTags) {
    // 在最后的 </div> 之前添加缺失的标签
    const lastDivIndex = template.lastIndexOf('</div>');
    if (lastDivIndex !== -1) {
      template = template.substring(0, lastDivIndex) + 
                additionalCloseTags + 
                template.substring(lastDivIndex);
      
      console.log('✅ 已添加缺失的结束标签');
    }
  }
}

// 3. 检查特殊的Vue组件标签
const vueComponentTags = ['el-collapse', 'el-collapse-item', 'template'];
vueComponentTags.forEach(tag => {
  const openRegex = new RegExp(`<${tag}[^>]*(?<!/)>`, 'g');
  const closeRegex = new RegExp(`</${tag}>`, 'g');
  
  const openMatches = template.match(openRegex) || [];
  const closeMatches = template.match(closeRegex) || [];
  
  console.log(`${tag}: 开始${openMatches.length} / 结束${closeMatches.length}`);
  
  if (openMatches.length > closeMatches.length) {
    const missing = openMatches.length - closeMatches.length;
    console.log(`⚠️  ${tag} 缺少 ${missing} 个结束标签`);
    
    // 对于Vue组件，在适当位置添加结束标签
    if (tag === 'el-collapse-item') {
      // 在el-collapse结束前添加
      const collapseEndIndex = template.lastIndexOf('</el-collapse>');
      if (collapseEndIndex !== -1) {
        for (let i = 0; i < missing; i++) {
          template = template.substring(0, collapseEndIndex) + 
                    '        </el-collapse-item>\n' + 
                    template.substring(collapseEndIndex);
        }
      }
    } else if (tag === 'el-collapse') {
      // 在适当的div结束前添加
      const divEndIndex = template.lastIndexOf('</div>');
      if (divEndIndex !== -1) {
        for (let i = 0; i < missing; i++) {
          template = template.substring(0, divEndIndex) + 
                    '      </el-collapse>\n' + 
                    template.substring(divEndIndex);
        }
      }
    } else if (tag === 'template') {
      // 查找#title的template并添加结束标签
      const titleTemplateIndex = template.indexOf('<template #title>');
      if (titleTemplateIndex !== -1) {
        // 查找下一个合适的位置添加</template>
        const nextDivIndex = template.indexOf('</div>', titleTemplateIndex);
        if (nextDivIndex !== -1) {
          template = template.substring(0, nextDivIndex) + 
                    '          </template>\n' + 
                    template.substring(nextDivIndex);
        }
      }
    }
  }
});

// 4. 重新构建完整文件
const newContent = content.replace(/<template>[\s\S]*?<\/template>/, `<template>${template}</template>`);

// 5. 保存修复后的文件
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('\n✅ HTML结构修复完成！');
console.log('📄 修复后文件行数:', newContent.split('\n').length);

// 6. 再次验证
console.log('\n🔍 验证修复结果...');
const verifyTemplate = newContent.match(/<template>([\s\S]*?)<\/template>/)[1];

['div', 'main', 'section', 'el-collapse', 'el-collapse-item', 'template'].forEach(tag => {
  const openRegex = new RegExp(`<${tag}[^>]*(?<!/)>`, 'g');
  const closeRegex = new RegExp(`</${tag}>`, 'g');
  
  const openMatches = verifyTemplate.match(openRegex) || [];
  const closeMatches = verifyTemplate.match(closeRegex) || [];
  
  const status = openMatches.length === closeMatches.length ? '✅' : '❌';
  console.log(`${status} ${tag}: 开始${openMatches.length} / 结束${closeMatches.length}`);
});

console.log('\n🎉 修复完成！请重新启动开发服务器测试。');
