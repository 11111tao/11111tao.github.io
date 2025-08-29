// Material Web 组件引入
import '@material/web/all.js';

// 全局变量
let marked = null;
let blogData = {};
let noteData = {}; // Added for notes

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
async function loadBlogData() {
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
        blogData = {};
    }

    // Fetch blogs from server
    try {
        const response = await fetch('/api/blogs');
        if (response.ok) {
            const result = await response.json();
            if (result.ok && result.blogs) {
                result.blogs.forEach(blog => {
                    if (!blogData[blog.title]) { // Add only new blogs
                        blogData[blog.title] = blog;
                    }
                });
                saveBlogData(); // Save merged data back to localStorage
                console.log('成功从服务器加载博客数据！');
            }
        } else {
            console.error('从服务器加载博客数据失败:', response.statusText);
        }
    } catch (error) {
        console.error('获取博客数据失败:', error);
    }
}

// 保存笔记数据到 localStorage
function saveNoteData() {
    try {
        localStorage.setItem('noteData', JSON.stringify(noteData));
        console.log('成功保存笔记数据到 localStorage');
    } catch (error) {
        console.error('保存笔记数据失败:', error);
    }
}

// 从 localStorage 加载笔记数据
async function loadNoteData() {
    const savedData = localStorage.getItem('noteData');
    if (savedData) {
        try {
            noteData = JSON.parse(savedData);
            console.log('成功从 localStorage 加载笔记数据');
        } catch (error) {
            console.error('解析 localStorage 数据失败:', error);
            noteData = {};
        }
    } else {
        noteData = {};
    }

    // Fetch notes from server
    try {
        const response = await fetch('/api/notes');
        if (response.ok) {
            const result = await response.json();
            if (result.ok && result.notes) {
                result.notes.forEach(note => {
                    if (!noteData[note.title]) { // Add only new notes
                        noteData[note.title] = note;
                    }
                });
                saveNoteData(); // Save merged data back to localStorage
                console.log('成功从服务器加载笔记数据！');
            }
        } else {
            console.error('从服务器加载笔记数据失败:', response.statusText);
        }
    } catch (error) {
        console.error('获取笔记数据失败:', error);
    }
}

// 创建 Markdown 阅读模态框
function createMarkdownModal() {
    const modal = document.createElement('div');
    modal.className = 'markdown-modal'; // Changed class name
    modal.id = 'markdown-modal'; // Changed ID
    modal.style.display = 'none';
    
    modal.innerHTML = `
        <div class="markdown-modal-content">
            <div class="markdown-modal-header">
                <h2 id="markdown-modal-title"></h2>
                <div id="markdown-modal-meta"></div>
                <button id="close-markdown-modal" class="close-button">
                    <md-icon>close</md-icon>
                </button>
            </div>
            <div class="markdown-modal-body" id="markdown-modal-content"></div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 关闭模态框
    document.getElementById('close-markdown-modal').addEventListener('click', () => {
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

// 显示 Markdown 内容模态框
function showMarkdownModal(title, meta, markdownContent) {
    const modal = document.getElementById('markdown-modal');
    const modalTitle = document.getElementById('markdown-modal-title');
    const modalMeta = document.getElementById('markdown-modal-meta');
    const modalContent = document.getElementById('markdown-modal-content');

    modalTitle.textContent = title;
    modalMeta.textContent = meta;

    if (marked) {
        const htmlContent = marked.parse(markdownContent);
        modalContent.innerHTML = htmlContent;
    } else {
        modalContent.textContent = markdownContent;
    }

    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
}

// 显示博客详情
function showBlogDetails(blogTitle) {
    const blog = blogData[blogTitle];
    if (!blog) return;
    showMarkdownModal(blog.title, `${blog.date} • ${blog.readTime}`, blog.fullContent || blog.content);
}

// 添加新博客到UI
function addBlogToUI(title, date, readTime, excerpt, content) {
    const blogPosts = document.querySelector('.blog-posts');
    if (!blogPosts) return;
    
    const newBlog = document.createElement('md-outlined-card'); // Use md-outlined-card for consistency
    newBlog.className = 'blog-post-card'; // A new class for consistent styling
    newBlog.innerHTML = `
        <div class="blog-content">
            <h3>${title}</h3>
            <p class="blog-meta">${date} • ${readTime}</p>
            <p>${excerpt}</p>
            <div class="blog-actions">
                <md-filled-button onclick="showBlogDetails('${title}')" style="width: 150px;">
                    <md-icon slot="icon">read_more</md-icon>
                    阅读更多
                </md-filled-button>
            </div>
        </div>
    `;
    
    // Store full content for modal
    blogData[title].fullContent = content;

    blogPosts.insertBefore(newBlog, blogPosts.firstChild);
}

// 添加新笔记到UI
function addNoteToUI(title, date, excerpt, content) {
    const notesGrid = document.querySelector('.notes-grid');
    if (!notesGrid) return;

    const newNote = document.createElement('md-outlined-card'); // Use md-outlined-card for consistency
    newNote.className = 'note-post-card'; // A new class for consistent styling
    newNote.innerHTML = `
        <div class="note-content">
            <h3>${title}</h3>
            <p class="note-meta">${date}</p>
            <p>${excerpt}</p>
            <div class="blog-actions">
                <md-filled-button onclick="showNoteDetails('${title}')" style="width: 150px;">
                    <md-icon slot="icon">read_more</md-icon>
                    阅读更多
                </md-filled-button>
            </div>
        </div>
    `;
    
    // Store full content for modal
    noteData[title].fullContent = content;

    notesGrid.insertBefore(newNote, notesGrid.firstChild);
}

// 显示笔记详情
function showNoteDetails(noteTitle) {
    const note = noteData[noteTitle];
    if (!note) return;
    showMarkdownModal(note.title, note.date, note.fullContent || note.content);
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

// Make functions globally accessible for inline onclick handlers
window.showBlogDetails = showBlogDetails;
window.showNoteDetails = showNoteDetails;
window.toggleFavorite = toggleFavorite;

// 渲染博客列表
function renderBlogList() {
    const blogPosts = document.querySelector('.blog-posts');
    if (!blogPosts) return;
    
    // Clear existing blog list, preserve upload container
    const uploadContainer = blogPosts.nextElementSibling; // Get the next sibling (upload container)
    blogPosts.innerHTML = ''; // Clear existing articles
    if (uploadContainer && uploadContainer.className.includes('upload-container')) {
        blogPosts.after(uploadContainer); // Re-insert upload container after clearing
    }

    // Re-add all blog articles
    Object.keys(blogData).forEach(title => {
        const blog = blogData[title];
        const excerpt = blog.content.substring(0, 150) + '...';
        addBlogToUI(title, blog.date, blog.readTime, excerpt, blog.content);
    });
}

// 渲染笔记列表
function renderNoteList() {
    const notesGrid = document.querySelector('.notes-grid');
    if (!notesGrid) return;

    // Clear existing note list, preserve upload container
    const uploadContainer = notesGrid.nextElementSibling; // Get the next sibling (upload container)
    notesGrid.innerHTML = ''; // Clear existing notes
    if (uploadContainer && uploadContainer.className.includes('upload-container')) {
        notesGrid.after(uploadContainer); // Re-insert upload container after clearing
    }

    // Re-add all notes
    Object.keys(noteData).forEach(title => {
        const note = noteData[title];
        const excerpt = note.content.substring(0, 150) + '...';
        addNoteToUI(title, note.date, excerpt, note.content);
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
    uploadButton.innerHTML = '<md-icon slot="icon">upload_file</md-icon>上传博客';
    uploadButton.style.width = '180px';
    
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.md,.markdown';
    fileInput.style.display = 'none';
    fileInput.id = 'blog-file-input';
    
    uploadContainer.appendChild(uploadButton);
    uploadContainer.appendChild(fileInput);
    
    const blogPosts = blogPanel.querySelector('.blog-posts');
    if (blogPosts) {
        blogPosts.after(uploadContainer); // Insert after blog posts
    } else {
        blogPanel.appendChild(uploadContainer); // Fallback if no blog posts yet
    }
    
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
                addBlogToUI(title, dateStr, readTime, markdownContent.substring(0, 150) + '...', markdownContent);
                
                // 上传到后端
                const formData = new FormData();
                formData.append('file', file);
                fetch('/api/upload-blog', {
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

// 笔记上传功能
function setupNoteUpload() {
    const notePanel = document.getElementById('note-panel');
    if (!notePanel) return;

    const uploadContainer = document.createElement('div');
    uploadContainer.className = 'upload-container';

    const uploadButton = document.createElement('md-filled-button');
    uploadButton.id = 'upload-note-button';
    uploadButton.innerHTML = '<md-icon slot="icon">upload_file</md-icon>上传笔记';
    uploadButton.style.minWidth = '180px';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.md,.markdown';
    fileInput.style.display = 'none';
    fileInput.id = 'note-file-input';

    uploadContainer.appendChild(uploadButton);
    uploadContainer.appendChild(fileInput);

    const notesGrid = notePanel.querySelector('.notes-grid');
    if (notesGrid) {
        notesGrid.after(uploadContainer); // Insert after notes grid
    } else {
        notePanel.appendChild(uploadContainer); // Fallback if no notes yet
    }

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
                let title = '新上传的笔记';
                if (lines.length > 0 && lines[0].startsWith('# ')) {
                    title = lines[0].substring(2).trim();
                }

                // 生成日期
                const today = new Date();
                const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

                // 保存笔记数据
                noteData[title] = {
                    title: title,
                    date: dateStr,
                    content: markdownContent
                };

                saveNoteData();
                addNoteToUI(title, dateStr, markdownContent.substring(0, 150) + '...', markdownContent);

                // Optionally, upload to backend if a /api/upload endpoint for notes exists
                const formData = new FormData();
                formData.append('file', file);
                fetch('/api/upload-note', {
                    method: 'POST',
                    body: formData
                }).then(res => res.json())
                  .then(data => console.log('服务器已保存笔记文件:', data))
                  .catch(error => {
                      console.error('上传笔记到服务器失败:', error);
                      alert('上传笔记到服务器失败，但已在本地添加。');
                  });

                console.log(`成功上传笔记: ${title}`);
            } catch (error) {
                console.error('上传笔记文件失败:', error);
                alert('上传笔记文件失败，请检查文件格式。');
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
                button.setAttribute('filled', 'true');
            } else {
                button.removeAttribute('filled');
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

    // 初始化时，根据URL哈希或默认选中第一个tab (作品)
    const initialTab = window.location.hash.substring(1) || tabButtons[0]?.getAttribute('data-tab');
    const initialButton = Array.from(tabButtons).find(button => button.getAttribute('data-tab') === initialTab);
    if (initialButton) {
        handleTabClick(initialButton);
    } else if (tabButtons.length > 0) {
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
            // Once marked is loaded, then load data and render
            loadBlogData();
            loadNoteData();
            renderBlogList();
            renderNoteList();
        })
        .catch((error) => {
            console.error('加载Markdown解析器失败:', error);
        });
    
    // 初始化功能 (moved inside .then block for marked loading)
    // loadBlogData(); 
    // renderBlogList();
    createMarkdownModal(); // Changed to createMarkdownModal
    setupBlogUpload();
    setupNoteUpload();
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