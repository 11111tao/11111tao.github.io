const fs = require('fs');
const parser = require('@babel/parser');

// 读取命令行参数指定的JSX文件
const filePath = process.argv[2] || './src/index.jsx';
const code = fs.readFileSync(filePath, 'utf-8');
const lines = code.split('\n');

try {
  // 解析JSX代码
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  console.log('代码解析成功，没有语法错误！');
} catch (error) {
  console.error('语法错误:', error.message);
  console.error('完整错误信息:', JSON.stringify(error, null, 2));
  console.error('错误位置: 第', error.loc.line, '行, 第', error.loc.column, '列');

  // 显示错误行及其前后几行
  const errorLine = error.loc.line;
  const startLine = Math.max(1, errorLine - 5);
  const endLine = Math.min(lines.length, errorLine + 5);

  console.error('错误上下文:');
  for (let i = startLine; i <= endLine; i++) {
    const prefix = i === errorLine ? '> ' : '  ';
    console.error(`${prefix}${i}: ${lines[i-1]}`);
  }
}