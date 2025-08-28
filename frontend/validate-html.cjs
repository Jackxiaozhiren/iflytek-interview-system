const fs = require('fs');

function validateHtmlTags(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
  
  if (!templateMatch) {
    console.log('❌ No template found');
    return false;
  }

  const template = templateMatch[1];
  const lines = template.split('\n');
  let stack = [];
  let lineNum = 0;
  let hasErrors = false;

  // 自闭合标签列表
  const selfClosingTags = ['el-icon', 'el-button', 'el-input', 'el-tag', 'el-progress', 'img', 'br', 'hr', 'input', 'meta', 'link'];

  // Element Plus组件标签（需要正常匹配）
  const elementPlusComponents = ['el-collapse', 'el-collapse-item', 'el-button', 'el-input', 'el-tag', 'el-progress', 'el-icon'];

  // Vue特殊标签
  const vueSpecialTags = ['template'];

  for (let line of lines) {
    lineNum++;
    
    // 移除注释
    const cleanLine = line.replace(/<!--[\s\S]*?-->/g, '');
    
    // 查找所有标签
    const tagMatches = cleanLine.match(/<[^>]+>/g) || [];
    
    for (let tag of tagMatches) {
      if (tag.startsWith('</')) {
        // 结束标签
        const tagName = tag.match(/<\/([a-zA-Z][a-zA-Z0-9-]*)/)?.[1];
        if (tagName && !selfClosingTags.includes(tagName) && (elementPlusComponents.includes(tagName) || !tagName.startsWith('el-'))) {
          if (stack.length === 0) {
            console.log(`❌ Line ${lineNum}: Unexpected closing tag </${tagName}>`);
            console.log(`   Content: ${line.trim()}`);
            hasErrors = true;
          } else {
            const last = stack.pop();
            if (last.tag !== tagName) {
              console.log(`❌ Mismatched tags:`);
              console.log(`   Expected: </${last.tag}> (opened at line ${last.line})`);
              console.log(`   Found: </${tagName}> (at line ${lineNum})`);
              console.log(`   Opening: ${last.content}`);
              console.log(`   Closing: ${line.trim()}`);
              hasErrors = true;
            }
          }
        }
      } else if (tag.endsWith('/>')) {
        // 自闭合标签，忽略
        continue;
      } else {
        // 开始标签
        const tagName = tag.match(/<([a-zA-Z][a-zA-Z0-9-]*)/)?.[1];
        if (tagName && !selfClosingTags.includes(tagName) && (elementPlusComponents.includes(tagName) || !tagName.startsWith('el-'))) {
          // 对于Vue的template标签，需要特殊处理
          if (tagName === 'template' && tag.includes('#')) {
            // Vue slot template，需要正常匹配
            stack.push({
              tag: tagName,
              line: lineNum,
              content: line.trim()
            });
          } else if (tagName !== 'template') {
            stack.push({
              tag: tagName,
              line: lineNum,
              content: line.trim()
            });
          }
        }
      }
    }
  }

  // 检查未闭合的标签
  if (stack.length > 0) {
    console.log('❌ Unclosed tags:');
    for (let item of stack) {
      console.log(`   - <${item.tag}> at line ${item.line}: ${item.content}`);
    }
    hasErrors = true;
  }

  if (!hasErrors) {
    console.log('✅ All HTML tags are properly matched');
  }

  return !hasErrors;
}

// 运行验证
const filePath = 'src/views/TextPrimaryInterviewPage.vue';
validateHtmlTags(filePath);
