// Material Web 组件引入
import '@material/web/all.js';

// 全局变量
let marked = null;
let blogData = {};

// 加载 Markdown 解析器
function loadMarkedLibrary() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        script.onload = () => resolve(window.marked);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// 保存博客数据到 localStorage
function saveBlogData() {
    try {
        localStorage.setItem('blogData', JSON.stringify(blogData));
        console.log('成功保存博客数据到 localStorage');
    } catch (error) {
        console.error('保存博客数据失败:', error);
    }
}

// 从 localStorage 加载博客数据
function loadBlogData() {
    const savedData = localStorage.getItem('blogData');
    if (savedData) {
        try {
            blogData = JSON.parse(savedData);
            console.log('成功从 localStorage 加载博客数据');
        } catch (error) {
            console.error('解析 localStorage 数据失败:', error);
            blogData = {};
        }
    } else {
        // 初始化默认博客数据
        blogData = {
            '构建现代化Web应用的完整指南': {
                title: '构建现代化Web应用的完整指南',
                date: '2024-01-20',
                readTime: '10分钟阅读',
                content: '# 构建现代化Web应用的完整指南\n\n## 1. 技术选型\n\n在开始任何Web项目之前，选择合适的技术栈至关重要...'
            },
            '前端性能优化的最佳实践': {
                title: '前端性能优化的最佳实践',
                date: '2024-01-18',
                readTime: '8分钟阅读',
                content: '# 前端性能优化的最佳实践\n\n前端性能对用户体验和SEO至关重要...'
            }
        };
    }
}

// 创建博客详情模态框
function createBlogModal() {
    const modal = document.createElement('div');
    modal.className = 'blog-modal';
    modal.id = 'blog-modal';
    modal.style.display = 'none';
    
    modal.innerHTML = `
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
    
    if (marked) {
        const htmlContent = marked.parse(blog.content);
        modalContent.innerHTML = htmlContent;
    } else {
        modalContent.textContent = blog.content;
    }
    
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
            <md-filled-button onclick="showBlogDetails('${title}')">
                <md-icon slot="icon">article</md-icon>
                阅读全文
            </md-filled-button>
            <md-text-button onclick="toggleFavorite(this)">
                <md-icon slot="icon">favorite_border</md-icon>
                收藏
            </md-filled-button>
        </div>
    `;
    
    blogPosts.insertBefore(newBlog, blogPosts.firstChild);
}

// 收藏切换功能
function toggleFavorite(button) {
    const icon = button.querySelector('md-icon');
    if (icon.textContent === 'favorite_border') {
        icon.textContent = 'favorite';
    } else {
        icon.textContent = 'favorite_border';
    }
}

// 渲染博客列表
function renderBlogList() {
    const blogPosts = document.querySelector('.blog-posts');
    if (!blogPosts) return;
    
    // 清空现有博客列表，保留上传容器
    const uploadContainer = document.querySelector('.upload-container');
    if (uploadContainer) {
        const blogPostElements = document.querySelectorAll('.blog-post');
        blogPostElements.forEach(post => post.remove());
    } else {
        blogPosts.innerHTML = '';
    }
    
    // 重新添加所有博客文章
    Object.keys(blogData).forEach(title => {
        const blog = blogData[title];
        const excerpt = blog.content.substring(0, 150) + '...';
        addBlogToUI(title, blog.date, blog.readTime, excerpt);
    });
}

// 博客上传功能
function setupBlogUpload() {
    const blogPanel = document.getElementById('blog-panel');
    if (!blogPanel) return;
    
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
    
    const blogHeader = blogPanel.querySelector('h2');
    blogHeader.after(uploadContainer);
    
    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const markdownContent = e.target.result;
                
                // 提取标题
                const lines = markdownContent.split('\n');
                let title = '新上传的博客';
                if (lines.length > 0 && lines[0].startsWith('# ')) {
                    title = lines[0].substring(2).trim();
                }
                
                // 生成日期和阅读时间
                const today = new Date();
                const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                const wordCount = markdownContent.split(/\s+/).length;
                const readTime = `${Math.ceil(wordCount / 200)}分钟阅读`;
                
                // 保存博客数据
                blogData[title] = {
                    title: title,
                    date: dateStr,
                    readTime: readTime,
                    content: markdownContent
                };
                
                saveBlogData();
                addBlogToUI(title, dateStr, readTime, markdownContent.substring(0, 150) + '...');
                
                // 上传到后端
                const formData = new FormData();
                formData.append('file', file);
                fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                }).then(res => res.json())
                  .then(data => console.log('服务器已保存文件:', data))
                  .catch(error => {
                      console.error('上传到服务器失败:', error);
                      alert('上传到服务器失败，但已在本地添加。');
                  });
                
                console.log(`成功上传博客: ${title}`);
            } catch (error) {
                console.error('上传文件失败:', error);
                alert('上传文件失败，请检查文件格式。');
            }
        };
        reader.readAsText(file);
    });
}

// 主题切换功能
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
        });
    }
}

//标签按钮高亮功能


// 标签页切换功能
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    function handleTabClick(clickedButton) {
        const targetTab = clickedButton.getAttribute('data-tab');
        
        // 更新按钮状态
        tabButtons.forEach(button => {
            const isActive = button.getAttribute('data-tab') === targetTab;
            if (isActive) {
                button.classList.remove('md-outlined-button');
                button.classList.add('md-filled-button');
            } else {
                button.classList.remove('md-filled-button');
                button.classList.add('md-outlined-button');
            }
        });
        

        // 显示对应标签页
        tabPanels.forEach(panel => {
            panel.style.display = 'none';
        });
        
        const targetPanel = document.getElementById(`${targetTab}-panel`);
        if (targetPanel) {
            targetPanel.style.display = 'block';
        }
    }
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => handleTabClick(button));
    });

    // 初始化时，默认选中第一个tab (作品)
    if (tabButtons.length > 0) {
        handleTabClick(tabButtons[0]);
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 头像加载检测
    const avatar = document.querySelector('.avatar');
    if (avatar) {
        avatar.addEventListener('load', () => console.log('头像加载成功！'));
        avatar.addEventListener('error', () => {
            console.error('头像加载失败！');
            avatar.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iNjAiIGZpbGw9IiM2NzUwYTQiLz4KPHN2ZyB4PSIzMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAxMkMxNC4yMSAxMiAxNiAxMC4yMSAxNiA4QzE2IDUuNzkgMTQuMjEgNCAxMiA0QzkuNzkgNCA4IDUuNzkgOCA4QzggMTAuMjEgOS43OSAxMiAxMiAxMlpNMTIgMTRDOS4zMyAxNCA3IDExLjY3IDcgOUgxN0MxNyAxMS42NyAxNC42NyAxNCAxMiAxNFoiLz4KPC9zdmc+Cjwvc3ZnPgo=';
        });
    }
    
    // 社交媒体链接
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', () => {
            const title = link.getAttribute('title');
            console.log(`点击了 ${title} 链接`);
        });
    });
    
    // 项目卡片
    const projectButtons = document.querySelectorAll('.project-content md-filled-button');
    projectButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const projectTitle = event.target.closest('.project-content').querySelector('h3').textContent;
            console.log(`查看项目: ${projectTitle}`);
        });
    });
    
    // 笔记阅读更多
    const noteButtons = document.querySelectorAll('.note-content md-text-button');
    noteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const noteTitle = event.target.closest('.note-content').querySelector('h3').textContent;
            console.log(`阅读笔记: ${noteTitle}`);
        });
    });
}

// 主函数
function initializeApp() {
    console.log('Material Web 组件加载成功！');
    
    // 加载 marked 库
    loadMarkedLibrary()
        .then((markedInstance) => {
            marked = markedInstance;
            console.log('Markdown解析器加载成功！');
        })
        .catch((error) => {
            console.error('加载Markdown解析器失败:', error);
        });
    
    // 初始化功能
    loadBlogData();
    renderBlogList();
    createBlogModal();
    setupBlogUpload();
    setupThemeToggle();
    setupTabNavigation();
    setupEventListeners();
}

// 等待 DOM 加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}