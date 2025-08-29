// 手动创建的修复文件
// 从index.jsx复制，但排除可能的隐藏字符

document.addEventListener('DOMContentLoaded', () => {
  // 初始化博客数据
  let blogData = {};

  // 在DOMContentLoaded之后加载marked库
  loadMarkedLibrary().then(markedInstance => {
      marked = markedInstance;
      console.log('Markdown解析器加载成功！');
  }).catch(error => {
      console.error('加载Markdown解析器失败:', error);
  });

  // 其他代码...

  // 从localStorage加载博客数据
  loadBlogData();

  // 首次渲染博客列表
  renderBlogList();

  // 创建博客详情模态框
  createBlogModal();

  // 设置博客上传功能
  setupBlogUpload();
});