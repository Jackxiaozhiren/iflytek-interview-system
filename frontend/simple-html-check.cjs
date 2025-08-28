const fs = require('fs');

console.log('🔍 检查 TextPrimaryInterviewPage.vue 的HTML结构...\n');

const content = fs.readFileSync('src/views/TextPrimaryInterviewPage.vue', 'utf8');

// 提取template部分
const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
if (!templateMatch) {
  console.log('❌ 没有找到template标签');
  process.exit(1);
}

const template = templateMatch[1];

// 简单的标签计数
const tags = {
  'div': { open: 0, close: 0 },
  'main': { open: 0, close: 0 },
  'section': { open: 0, close: 0 },
  'header': { open: 0, close: 0 },
  'el-collapse': { open: 0, close: 0 },
  'el-collapse-item': { open: 0, close: 0 },
  'template': { open: 0, close: 0 }
};

// 计算开始标签
Object.keys(tags).forEach(tag => {
  const openRegex = new RegExp(`<${tag}[^>]*(?<!/)>`, 'g');
  const matches = template.match(openRegex) || [];
  tags[tag].open = matches.length;
});

// 计算结束标签
Object.keys(tags).forEach(tag => {
  const closeRegex = new RegExp(`</${tag}>`, 'g');
  const matches = template.match(closeRegex) || [];
  tags[tag].close = matches.length;
});

console.log('📊 标签统计:');
Object.keys(tags).forEach(tag => {
  const { open, close } = tags[tag];
  const status = open === close ? '✅' : '❌';
  console.log(`${status} ${tag}: 开始${open} / 结束${close}`);
});

// 检查是否有不匹配的标签
const hasErrors = Object.keys(tags).some(tag => tags[tag].open !== tags[tag].close);

if (hasErrors) {
  console.log('\n❌ 发现标签不匹配的问题！');
} else {
  console.log('\n✅ 所有标签都正确匹配！');
}

// 检查特殊的Vue语法
const vueDirectives = template.match(/v-[a-z-]+/g) || [];
const slotUsage = template.match(/#[a-z-]+/g) || [];

console.log(`\n📝 Vue指令数量: ${vueDirectives.length}`);
console.log(`📝 插槽使用数量: ${slotUsage.length}`);

// 检查可能的问题区域
const problemPatterns = [
  { pattern: /<[^>]*[^\/]>\s*$/, name: '行末未闭合标签' },
  { pattern: /^\s*<\/[^>]*>/, name: '行首结束标签' },
  { pattern: /<[^>]*>\s*<[^>]*>/, name: '连续开始标签' }
];

console.log('\n🔍 潜在问题检查:');
problemPatterns.forEach(({ pattern, name }) => {
  const matches = template.match(pattern);
  if (matches) {
    console.log(`⚠️  发现 ${name}: ${matches.length} 处`);
  } else {
    console.log(`✅ ${name}: 无问题`);
  }
});
