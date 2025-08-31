// Material Web 组件引入
import '@material/web/all.js';

// 确保 Material Web 组件在 DOM 加载后注册
if (typeof window !== 'undefined') {
    // 等待组件定义完成
    const ensureComponentsLoaded = async () => {
        const componentNames = [
            'md-filled-button',
            'md-outlined-button',
            'md-text-button',
            'md-icon-button',
            'md-icon',
            'md-outlined-card',
            'md-assist-chip',
            'md-suggestion-chip'
        ];
        
        for (const name of componentNames) {
            if (!customElements.get(name)) {
                await customElements.whenDefined(name);
            }
        }
    };
    
    ensureComponentsLoaded().then(() => {
        console.log('所有 Material Web 组件已加载完成');
    }).catch((error) => {
        console.warn('Material Web 组件加载出现问题:', error);
    });
}

// 全局变量
let marked = null;
let blogData = {};
let noteData = {}; // Added for notes
let currentTags = []; // 当前选择的标签（用于上传时）
let activeFilter = null; // 当前激活的标签过滤器

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
        // 如果是首次访问，添加一些示例数据
        blogData = {
            '示例博客文章': {
                title: '示例博客文章',
                date: '2024-01-15',
                readTime: '3分钟阅读',
                content: '# 示例博客文章\n\n这是一篇示例博客文章，展示个人网站的博客功能。\n\n## 写作的意义\n\n在这个信息爆炸的时代，写作不仅是记录思想的方式，更是整理思维、深化理解的重要工具。通过写作，我们可以：\n\n- **整理思维**: 将脑海中的想法系统化地表达出来\n- **分享见解**: 与他人交流自己的观点和经验\n- **记录成长**: 记录学习和生活中的点点滴滴\n\n## 个人博客的价值\n\n### 知识管理\n个人博客是一个很好的知识管理平台，可以：\n1. 记录学习心得\n2. 整理项目经验  \n3. 分享技术见解\n\n### 个人品牌\n通过持续的内容输出，可以：\n- 展示专业能力\n- 建立行业影响力\n- 扩展人际网络\n\n## 技术实现\n\n这个个人网站使用了现代的Web技术栈：\n- **Material Design 3**: 提供优雅的UI设计\n- **标签系统**: 便于内容分类和检索\n- **响应式设计**: 适配各种设备\n\n## 总结\n\n建立个人博客是一个很好的开始，它不仅能帮助我们记录和分享，更重要的是培养持续学习和思考的习惯。\n\n---\n\n*发布日期: 2024年*  \n*阅读时间: 3分钟*',
                tags: ['写作', '个人博客', '技术分享', '示例']
            }
        };
    }

    // Try to fetch blogs from server (only works in development)
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
            console.log('服务器不可用，使用本地数据');
        }
    } catch (error) {
        console.log('无法连接到服务器，使用本地数据 (GitHub Pages 模式)');
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
        // 如果是首次访问，添加一些示例数据
        noteData = {
            '示例学习笔记': {
                title: '示例学习笔记',
                date: '2024-01-10',
                content: '# 示例学习笔记\n\n这是一个学习笔记的示例，展示如何记录和整理学习内容。\n\n## 学习目标\n\n- 掌握有效的笔记记录方法\n- 理解知识点之间的联系\n- 建立完整的学习体系\n\n## 主要内容\n\n### 重点概念\n\n**关键词1**: 这里是对关键概念的详细解释和理解。\n\n**关键词2**: 另一个重要概念的说明，可以包含：\n- 定义\n- 特点\n- 应用场景\n\n### 知识要点\n\n1. **第一个要点**: 详细说明\n2. **第二个要点**: 相关内容和例子\n3. **第三个要点**: 实际应用\n\n## 学习心得\n\n通过这次学习，我深刻理解了...\n\n## 参考资料\n\n- 相关书籍或文献\n- 在线资源\n- 其他学习材料\n\n---\n\n*记录时间: 2024年*  \n*标签: 学习方法, 知识管理*',
                tags: ['学习方法', '知识管理', '示例']
            }
        };
    }

    // Try to fetch notes from server (only works in development)
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
            console.log('服务器不可用，使用本地数据');
        }
    } catch (error) {
        console.log('无法连接到服务器，使用本地数据 (GitHub Pages 模式)');
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
function addBlogToUI(title, date, readTime, excerpt, content, tags = []) {
    const blogPosts = document.querySelector('.blog-posts');
    if (!blogPosts) return;
    
    // 如果有活跃的标签过滤器，检查是否匹配
    if (activeFilter && (!tags || !tags.includes(activeFilter))) {
        return; // 不显示不匹配的项目
    }
    
    const tagsHtml = tags && tags.length > 0 ? 
        `<div class="blog-tags">
            ${tags.map(tag => `<button class="content-tag" onclick="filterByTag('${tag}')">${tag}</button>`).join('')}
        </div>` : '';
    
    const newBlog = document.createElement('md-outlined-card'); // Use md-outlined-card for consistency
    newBlog.className = 'blog-post-card'; // A new class for consistent styling
    newBlog.innerHTML = `
        <div class="blog-content">
            <h3>${title}</h3>
            <p class="blog-meta">${date} • ${readTime}</p>
            <p>${excerpt}</p>
            ${tagsHtml}
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
function addNoteToUI(title, date, excerpt, content, tags = []) {
    const notesGrid = document.querySelector('.notes-grid');
    if (!notesGrid) return;

    // 如果有活跃的标签过滤器，检查是否匹配
    if (activeFilter && (!tags || !tags.includes(activeFilter))) {
        return; // 不显示不匹配的项目
    }
    
    const tagsHtml = tags && tags.length > 0 ? 
        `<div class="note-tags">
            ${tags.map(tag => `<button class="content-tag" onclick="filterByTag('${tag}')">${tag}</button>`).join('')}
        </div>` : '';

    const newNote = document.createElement('md-outlined-card'); // Use md-outlined-card for consistency
    newNote.className = 'note-post-card'; // A new class for consistent styling
    newNote.innerHTML = `
        <div class="note-content">
            <h3>${title}</h3>
            <p class="note-meta">${date}</p>
            <p>${excerpt}</p>
            ${tagsHtml}
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

// 标签管理功能
function addTag(tag) {
    const trimmedTag = tag.trim();
    if (trimmedTag && !currentTags.includes(trimmedTag)) {
        currentTags.push(trimmedTag);
        updateTagsDisplay();
    }
}

function removeTag(tag) {
    const index = currentTags.indexOf(tag);
    if (index > -1) {
        currentTags.splice(index, 1);
        updateTagsDisplay();
    }
}

function clearCurrentTags() {
    currentTags = [];
    updateTagsDisplay();
}

function updateTagsDisplay() {
    const tagsDisplay = document.querySelector('.tags-display');
    if (!tagsDisplay) return;
    
    tagsDisplay.innerHTML = '';
    currentTags.forEach(tag => {
        const tagChip = document.createElement('span');
        tagChip.className = 'tag-chip';
        tagChip.innerHTML = `
            ${tag}
            <button class="remove-tag" onclick="removeTag('${tag}')" aria-label="移除标签">×</button>
        `;
        tagsDisplay.appendChild(tagChip);
    });
}

// 获取所有可用的标签
function getAllAvailableTags() {
    const allTags = new Set();
    
    // 从博客数据中收集标签
    Object.values(blogData).forEach(blog => {
        if (blog.tags && Array.isArray(blog.tags)) {
            blog.tags.forEach(tag => allTags.add(tag));
        }
    });
    
    // 从笔记数据中收集标签
    Object.values(noteData).forEach(note => {
        if (note.tags && Array.isArray(note.tags)) {
            note.tags.forEach(tag => allTags.add(tag));
        }
    });
    
    return Array.from(allTags).sort();
}

// 根据标签过滤内容
function filterByTag(tag) {
    activeFilter = tag;
    renderBlogList();
    renderNoteList();
    updateTagFilterDisplay();
}

// 清除标签过滤
function clearTagFilter() {
    activeFilter = null;
    renderBlogList();
    renderNoteList();
    updateTagFilterDisplay();
}

// 更新标签过滤器显示
function updateTagFilterDisplay() {
    const containers = document.querySelectorAll('.tag-filter-container');
    containers.forEach(container => {
        const activeTagSpan = container.querySelector('.active-filter-tag');
        if (activeFilter) {
            if (!activeTagSpan) {
                const filterInfo = document.createElement('div');
                filterInfo.className = 'active-filter-info';
                filterInfo.innerHTML = `
                    <span>正在显示标签: </span>
                    <span class="active-filter-tag">${activeFilter}</span>
                `;
                container.querySelector('.tag-filter-header').appendChild(filterInfo);
            } else {
                activeTagSpan.textContent = activeFilter;
            }
        } else {
            const filterInfo = container.querySelector('.active-filter-info');
            if (filterInfo) {
                filterInfo.remove();
            }
        }
    });
}

// 创建标签过滤器UI
function createTagFilterUI(panelId) {
    const panel = document.getElementById(panelId);
    if (!panel) return;
    
    // 检查是否已经存在过滤器
    if (panel.querySelector('.tag-filter-container')) return;
    
    const filterContainer = document.createElement('div');
    filterContainer.className = 'tag-filter-container';
    filterContainer.innerHTML = `
        <div class="tag-filter-header">
            <h4>按标签筛选</h4>
            <button class="clear-filter-button" onclick="clearTagFilter()">清除筛选</button>
        </div>
        <div class="available-tags"></div>
    `;
    
    // 插入到标题后面
    const title = panel.querySelector('h2');
    if (title) {
        title.after(filterContainer);
    } else {
        panel.insertBefore(filterContainer, panel.firstChild);
    }
    
    updateAvailableTagsDisplay(panelId);
}

// 更新可用标签显示
function updateAvailableTagsDisplay(panelId) {
    const panel = document.getElementById(panelId);
    if (!panel) return;
    
    const availableTagsContainer = panel.querySelector('.available-tags');
    if (!availableTagsContainer) return;
    
    const allTags = getAllAvailableTags();
    availableTagsContainer.innerHTML = '';
    
    if (allTags.length === 0) {
        availableTagsContainer.innerHTML = '<span style="color: var(--md-sys-color-on-surface-variant); font-size: var(--font-size-sm);">暂无标签</span>';
        return;
    }
    
    allTags.forEach(tag => {
        const tagButton = document.createElement('button');
        tagButton.className = `content-tag ${activeFilter === tag ? 'active' : ''}`;
        tagButton.textContent = tag;
        tagButton.onclick = () => filterByTag(tag);
        availableTagsContainer.appendChild(tagButton);
    });
}

// Make functions globally accessible for inline onclick handlers
window.showBlogDetails = showBlogDetails;
window.showNoteDetails = showNoteDetails;
window.toggleFavorite = toggleFavorite;
window.addTag = addTag;
window.removeTag = removeTag;
window.clearCurrentTags = clearCurrentTags;
window.filterByTag = filterByTag;
window.clearTagFilter = clearTagFilter;
window.addTagFromInput = addTagFromInput;
window.removeTagAndUpdate = removeTagAndUpdate;
window.cancelUpload = cancelUpload;
window.confirmUpload = confirmUpload;

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
        addBlogToUI(title, blog.date, blog.readTime, excerpt, blog.content, blog.tags || []);
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
        addNoteToUI(title, note.date, excerpt, note.content, note.tags || []);
    });
}

// 创建上传模态框
function createUploadModal(type) {
    const modal = document.createElement('div');
    modal.className = 'upload-modal';
    modal.id = `upload-${type}-modal`;
    modal.style.display = 'none';
    
    modal.innerHTML = `
        <div class="upload-modal-content">
            <div class="upload-modal-header">
                <h3>上传${type === 'blog' ? '博客' : '笔记'}</h3>
                <button id="close-upload-${type}-modal" class="close-button">
                    <md-icon>close</md-icon>
                </button>
            </div>
            <div class="upload-modal-body">
                <div class="file-info">
                    <h4>文件信息</h4>
                    <p id="file-name-${type}">未选择文件</p>
                    <p id="file-size-${type}"></p>
                </div>
                <div class="tag-input-container">
                    <h4>添加标签</h4>
                    <div class="tag-input-section">
                        <input type="text" class="tag-input" id="tag-input-${type}" placeholder="输入标签名，如：philosophy, exercise">
                        <md-filled-button class="add-tag-button" onclick="addTagFromInput('${type}')">
                            <md-icon slot="icon">add</md-icon>
                            添加
                        </md-filled-button>
                    </div>
                    <div class="tags-display" id="tags-display-${type}"></div>
                </div>
            </div>
            <div class="upload-modal-actions">
                <md-outlined-button onclick="cancelUpload('${type}')">
                    <md-icon slot="icon">cancel</md-icon>
                    取消
                </md-outlined-button>
                <md-filled-button onclick="confirmUpload('${type}')" id="confirm-upload-${type}">
                    <md-icon slot="icon">upload</md-icon>
                    确认上传
                </md-filled-button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 设置事件监听器
    document.getElementById(`close-upload-${type}-modal`).addEventListener('click', () => {
        cancelUpload(type);
    });
    
    // 点击模态框外部关闭
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            cancelUpload(type);
        }
    });
    
    // Enter键添加标签
    document.getElementById(`tag-input-${type}`).addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTagFromInput(type);
        }
    });
}

// 从输入框添加标签
function addTagFromInput(type) {
    const input = document.getElementById(`tag-input-${type}`);
    const tag = input.value.trim();
    if (tag) {
        addTag(tag);
        input.value = '';
        updateTagsDisplayInModal(type);
    }
}

// 更新模态框中的标签显示
function updateTagsDisplayInModal(type) {
    const tagsDisplay = document.getElementById(`tags-display-${type}`);
    if (!tagsDisplay) return;
    
    tagsDisplay.innerHTML = '';
    currentTags.forEach(tag => {
        const tagChip = document.createElement('span');
        tagChip.className = 'tag-chip';
        tagChip.innerHTML = `
            ${tag}
            <button class="remove-tag" onclick="removeTagAndUpdate('${tag}', '${type}')" aria-label="移除标签">×</button>
        `;
        tagsDisplay.appendChild(tagChip);
    });
}

// 移除标签并更新模态框显示
function removeTagAndUpdate(tag, type) {
    removeTag(tag);
    updateTagsDisplayInModal(type);
}

// 存储待上传的文件信息
let pendingUpload = {
    file: null,
    type: null
};

// 显示上传模态框
function showUploadModal(file, type) {
    pendingUpload = { file, type };
    clearCurrentTags();
    
    const modal = document.getElementById(`upload-${type}-modal`);
    if (!modal) return;
    
    // 更新文件信息
    document.getElementById(`file-name-${type}`).textContent = file.name;
    document.getElementById(`file-size-${type}`).textContent = `大小: ${(file.size / 1024).toFixed(1)} KB`;
    
    // 显示模态框
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
    
    // 聚焦到标签输入框
    setTimeout(() => {
        document.getElementById(`tag-input-${type}`).focus();
    }, 100);
}

// 取消上传
function cancelUpload(type) {
    const modal = document.getElementById(`upload-${type}-modal`);
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
    
    pendingUpload = { file: null, type: null };
    clearCurrentTags();
    
    // 清空文件输入框
    const fileInput = document.getElementById(`${type}-file-input`);
    if (fileInput) {
        fileInput.value = '';
    }
}

// 确认上传
function confirmUpload(type) {
    if (!pendingUpload.file) return;
    
    const modal = document.getElementById(`upload-${type}-modal`);
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
    
    if (type === 'blog') {
        processBlogUpload(pendingUpload.file, currentTags.slice());
    } else if (type === 'note') {
        processNoteUpload(pendingUpload.file, currentTags.slice());
    }
    
    pendingUpload = { file: null, type: null };
    clearCurrentTags();
}

// 处理博客上传
function processBlogUpload(file, tags) {
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
            
            // 保存博客数据（包含标签）
            blogData[title] = {
                title: title,
                date: dateStr,
                readTime: readTime,
                content: markdownContent,
                tags: tags
            };
            
            saveBlogData();
            addBlogToUI(title, dateStr, readTime, markdownContent.substring(0, 150) + '...', markdownContent, tags);
            
            // 更新标签过滤器UI
            updateAvailableTagsDisplay('blog-panel');
            updateAvailableTagsDisplay('note-panel');
            
            // 尝试上传到后端（仅在开发环境中工作）
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('tags', JSON.stringify(tags));
                fetch('/api/upload-blog', {
                    method: 'POST',
                    body: formData
                }).then(res => res.json())
                  .then(data => {
                      console.log('服务器已保存文件:', data);
                  })
                  .catch(error => {
                      console.log('开发服务器不可用，仅在本地保存');
                  });
            }
            
            console.log(`成功上传博客: ${title}, 标签: ${tags.join(', ')}`);
        } catch (error) {
            console.error('上传文件失败:', error);
            alert('上传文件失败，请检查文件格式。');
        }
    };
    reader.readAsText(file);
}

// 处理笔记上传
function processNoteUpload(file, tags) {
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
            
            // 保存笔记数据（包含标签）
            noteData[title] = {
                title: title,
                date: dateStr,
                content: markdownContent,
                tags: tags
            };
            
            saveNoteData();
            addNoteToUI(title, dateStr, markdownContent.substring(0, 150) + '...', markdownContent, tags);
            
            // 更新标签过滤器UI
            updateAvailableTagsDisplay('blog-panel');
            updateAvailableTagsDisplay('note-panel');
            
            // 尝试上传到后端（仅在开发环境中工作）
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('tags', JSON.stringify(tags));
                fetch('/api/upload-note', {
                    method: 'POST',
                    body: formData
                }).then(res => res.json())
                  .then(data => {
                      console.log('服务器已保存笔记文件:', data);
                  })
                  .catch(error => {
                      console.log('开发服务器不可用，仅在本地保存');
                  });
            }
            
            console.log(`成功上传笔记: ${title}, 标签: ${tags.join(', ')}`);
        } catch (error) {
            console.error('上传笔记文件失败:', error);
            alert('上传笔记文件失败，请检查文件格式。');
        }
    };
    reader.readAsText(file);
}

// 检查是否为本地开发环境
function isLocalDevelopment() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' || 
           window.location.hostname === '';
}

// 博客上传功能
function setupBlogUpload() {
    // 只在本地开发环境显示上传功能
    if (!isLocalDevelopment()) {
        console.log('生产环境：隐藏博客上传功能');
        return;
    }
    
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
        
        showUploadModal(file, 'blog');
    });
}

// 笔记上传功能
function setupNoteUpload() {
    // 只在本地开发环境显示上传功能
    if (!isLocalDevelopment()) {
        console.log('生产环境：隐藏笔记上传功能');
        return;
    }
    
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

        showUploadModal(file, 'note');
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
    console.log('开始初始化应用程序...');
    
    // 检查 Material Web 组件是否可用
    const checkMaterialComponents = () => {
        const testElement = document.createElement('md-filled-button');
        return testElement.tagName.toLowerCase() === 'md-filled-button';
    };
    
    const initializeCore = () => {
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
        
            // 初始化功能
    createMarkdownModal(); // Changed to createMarkdownModal
    
    // 只在本地开发环境创建上传相关功能
    if (isLocalDevelopment()) {
        createUploadModal('blog'); // Create blog upload modal
        createUploadModal('note'); // Create note upload modal
        console.log('开发环境：启用上传功能');
    } else {
        console.log('生产环境：禁用上传功能');
    }
    
    createTagFilterUI('blog-panel'); // Create tag filters for blog panel
    createTagFilterUI('note-panel'); // Create tag filters for note panel
    setupBlogUpload();
    setupNoteUpload();
    setupThemeToggle();
    setupTabNavigation();
    setupEventListeners();
        
        console.log('应用程序初始化完成！');
    };
    
    // 等待 Material Web 组件加载或使用回退方案
    if (checkMaterialComponents()) {
        console.log('Material Web 组件已可用');
        initializeCore();
    } else {
        console.log('等待 Material Web 组件加载...');
        // 等待一小段时间让组件加载
        setTimeout(() => {
            if (checkMaterialComponents()) {
                console.log('Material Web 组件延迟加载成功');
            } else {
                console.warn('Material Web 组件可能未正确加载，继续初始化');
            }
            initializeCore();
        }, 1000);
    }
}

// 等待 DOM 加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}