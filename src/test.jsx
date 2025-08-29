// 测试文件，用于定位语法错误

// 引入简单的Markdown解析器
// 使用脚本标签动态加载marked库
function loadMarkedLibrary() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        script.onload = () => resolve(window.marked);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// 全局变量存储marked实例
let marked = null;

// 保存博客数据到localStorage
function saveBlogData() {
    try {
        localStorage.setItem('blogData', JSON.stringify(blogData));
        console.log('成功保存博客数据到localStorage');
    } catch (error) {
        console.error('保存博客数据到localStorage失败:', error);
    }
}

// 从localStorage加载博客数据
function loadBlogData() {
    const savedData = localStorage.getItem('blogData');
    if (savedData) {
        try {
            blogData = JSON.parse(savedData);
            console.log('成功从localStorage加载博客数据');
        } catch (error) {
            console.error('解析localStorage数据失败:', error);
            blogData = {};
        }
    } else {
        // 初始化默认博客数据
        blogData = {};
    }
}

// 创建博客详情模态框
function createBlogModal() {
    const modal = document.createElement('div');
    modal.className = 'blog-modal';
    modal.id = 'blog-modal';
    modal.style.display = 'none';
    
    const modalContent = `
        <div class="blog-modal-content">
            <div class="blog-modal-header">
                <h2 id="modal-title"></h2>
                <div id="modal-meta"></div>
                <button id="close-modal" class="close-button">
                    <md-icon>close</md-icon>
                </button>
            </div>
            <div class="blog-modal-body" id="modal-content"></div>
        </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // 关闭模态框
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    });
    
    // 点击模态框外部关闭
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    });
}

// 显示博客详情
function showBlogDetails(blogTitle) {
    const blog = blogData[blogTitle];
    if (!blog) return;
    
    const modal = document.getElementById('blog-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMeta = document.getElementById('modal-meta');
    const modalContent = document.getElementById('modal-content');
    
    modalTitle.textContent = blog.title;
    modalMeta.textContent = `${blog.date} • ${blog.readTime}`;
    
    // 检查marked是否已加载
    if (marked) {
        // 将Markdown转换为HTML
        const htmlContent = marked.parse(blog.content);
        modalContent.innerHTML = htmlContent;
    } else {
        // 如果marked尚未加载，直接显示原始内容
        modalContent.textContent = blog.content;
        alert('Markdown解析器尚未加载完成，请稍候再试。');
    }
    
    // 显示模态框
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
}

// 添加新博客到UI
function addBlogToUI(title, date, readTime, excerpt) {
    const blogPosts = document.querySelector('.blog-posts');
    if (!blogPosts) return;
    
    const newBlog = document.createElement('article');
    newBlog.className = 'blog-post';
    newBlog.innerHTML = `
        <h3>${title}</h3>
        <p class="blog-meta">${date} • ${readTime}</p>
        <p>${excerpt}</p>
        <div class="blog-actions">
            <md-filled-button>
                <md-icon slot="icon">article</md-icon>
                阅读全文
            </md-filled-button>
            <md-text-button>
                <md-icon slot="icon">favorite_border</md-icon>
                收藏
            </md-text-button>
        </div>
    `;
    
    // 添加到博客列表的顶部
    blogPosts.insertBefore(newBlog, blogPosts.firstChild);
    
    // 为新添加的按钮绑定事件
    const readButton = newBlog.querySelector('.blog-actions md-filled-button');
    readButton.addEventListener('click', () => {
        showBlogDetails(title);
    });
    
    const favoriteButton = newBlog.querySelector('.blog-actions md-text-button');
    favoriteButton.addEventListener('click', (event) => {
        const icon = event.target.querySelector('md-icon');
        if (icon.textContent === 'favorite_border') {
            icon.textContent = 'favorite';
        } else {
            icon.textContent = 'favorite_border';
        }
    });
}

// 渲染博客列表
function renderBlogList() {
    // 清空现有博客列表
    const blogPosts = document.querySelector('.blog-posts');
    if (!blogPosts) return;
    
    // 保存上传容器
    const uploadContainer = document.querySelector('.upload-container');
    if (uploadContainer) {
        // 移除所有博客文章，但保留上传容器
        const blogPosts = document.querySelectorAll('.blog-post');
        blogPosts.forEach(post => post.remove());
    } else {
        // 如果没有上传容器，清空整个列表
        blogPosts.innerHTML = '';
    }
    
    // 重新添加所有博客文章
    Object.keys(blogData).forEach(title => {
        const blog = blogData[title];
        // 提取摘要
        const excerpt = blog.content.substring(0, 150) + '...';
        addBlogToUI(title, blog.date, blog.readTime, excerpt);
    });
}

// 博客上传功能定义
function setupBlogUpload() {
    // 检查博客面板是否存在
    const blogPanel = document.getElementById('blog-panel');
    if (!blogPanel) return;
    
    // 创建上传按钮
    const uploadContainer = document.createElement('div');
    uploadContainer.className = 'upload-container';
    
    const uploadButton = document.createElement('md-filled-button');
    uploadButton.id = 'upload-blog-button';
    uploadButton.innerHTML = '<md-icon slot="icon">upload_file</md-icon>上传Markdown文件';
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.md,.markdown';
    fileInput.style.display = 'none';
    fileInput.id = 'blog-file-input';
    
    uploadContainer.appendChild(uploadButton);
    uploadContainer.appendChild(fileInput);
    
    // 将上传按钮添加到博客面板顶部
    const blogHeader = blogPanel.querySelector('h2');
    blogHeader.after(uploadContainer);
    
    // 添加点击事件
    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });
    
    // 处理文件上传
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const markdownContent = e.target.result;
                
                // 提取标题（假设第一行是标题）
                const lines = markdownContent.split('\n');
                let title = '新上传的博客';
                if (lines.length > 0 && lines[0].startsWith('# ')) {
                    title = lines[0].substring(2).trim();
                }
                
                // 生成当前日期
                const today = new Date();
                const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                
                // 估计阅读时间
                const wordCount = markdownContent.split(/\s+/).length;
                const readTime = `${Math.ceil(wordCount / 200)}分钟阅读`;
                
                // 保存博客数据
                blogData[title] = {
                    title: title,
                    date: dateStr,
                    readTime: readTime,
                    content: markdownContent
                };
                
                // 保存到localStorage
                saveBlogData();
                
                // 添加到博客列表
                addBlogToUI(title, dateStr, readTime, markdownContent.substring(0, 150) + '...');
                
                console.log(`成功上传博客: ${title}`);
            } catch (error) {
                console.error('上传文件失败:', error);
                alert('上传文件失败，请检查文件格式。');
            }
        };
        reader.readAsText(file);
    });
}

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
  
  // 你也可以在这里写你自己的 JavaScript 代码
  console.log('Material Web 组件加载成功！');
  
  // 添加一些交互功能
  
  // 头像加载检测
  const avatar = document.querySelector('.avatar');
  if (avatar) {
      avatar.addEventListener('load', () => {
          console.log('头像加载成功！');
      });
      
      avatar.addEventListener('error', () => {
          console.error('头像加载失败！');
          // 设置默认头像
          avatar.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iNjAiIGZpbGw9IiM2NzUwYTQiLz4KPHN2ZyB4PSIzMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAxMkMxNC4yMSAxMiAxNiAxMC4yMSAxNiA4QzE2IDUuNzkgMTQuMjEgNCAxMiA0QzkuNzkgNCA4IDUuNzkgOCA4QzggMTAuMjEgOS43OSAxMiAxMiAxMlpNMTIgMTRDOS4zMyAxNCA3IDExLjY3IDcgOUgxN0MxNyAxMS42NyAxNC42NyAxNCAxMiAxNFoiLz4KPC9zdmc+Cjwvc3ZnPgo=';
      });
  }
  
  // 主题切换功能
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
      themeToggle.addEventListener('click', () => {
          document.body.classList.toggle('dark-theme');
      });
  }
  
  // 从localStorage加载博客数据
  loadBlogData();
  
  // 首次渲染博客列表
  renderBlogList();
  
  // 创建博客详情模态框
  createBlogModal();
  
  // 设置博客上传功能
  setupBlogUpload();
});

console.log('测试文件加载成功！');