// script.js

document.addEventListener('DOMContentLoaded', () => {
    const newsListDiv = document.getElementById('news-list');
    const newsDetailDiv = document.getElementById('news-detail');
    const addNewsModal = document.getElementById('addNewsModal');
    const addNewsForm = document.getElementById('addNewsForm');
    const successMessage = document.getElementById('success-message');
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentTimeDiv = document.getElementById('current-time');

    let allNews = [];

    // Function to update current time
    function updateCurrentTime() {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        currentTimeDiv.textContent = now.toLocaleDateString('zh-CN', options);
    }

    // Update time every second
    setInterval(updateCurrentTime, 1000);
    updateCurrentTime(); // Initial call

    // Fetch news from backend
    async function fetchNews() {
        try {
            const response = await fetch('/api/news');
            const data = await response.json();
            allNews = data;
            displayNews(allNews);
        } catch (error) {
            console.error('Error fetching news:', error);
            // Fallback to default news if backend is not available or errors
            allNews = defaultNews;
            displayNews(allNews);
        }
    }

    // Display news cards
    function displayNews(newsToDisplay) {
        newsListDiv.innerHTML = '';
        if (newsToDisplay.length === 0) {
            newsListDiv.innerHTML = '<p>暂无新闻。</p>';
            return;
        }
        newsToDisplay.forEach(news => {
            const newsCard = document.createElement('div');
            newsCard.classList.add('news-card');
            newsCard.innerHTML = `
                <img src="${news.image || 'https://via.placeholder.com/400x200?text=No+Image'}" alt="${news.title}" class="news-image">
                <div class="news-content">
                    <span class="news-category">${news.category}</span>
                    <h3 class="news-title">${news.title}</h3>
                    <p class="news-summary">${news.summary}</p>
                    <div class="news-meta">
                        <span class="news-author">${news.author}</span>
                        <span class="news-date">${news.date}</span>
                    </div>
                </div>
            `;
            newsCard.addEventListener('click', () => showNewsDetail(news.id));
            newsListDiv.appendChild(newsCard);
        });
    }

    // Show news detail page
    async function showNewsDetail(id) {
        newsListDiv.style.display = 'none';
        newsDetailDiv.style.display = 'block';

        let news = allNews.find(n => n.id === id);

        if (!news) {
            // Try fetching from backend if not found in current list (e.g., direct link)
            try {
                const response = await fetch(`/api/news/${id}`);
                news = await response.json();
            } catch (error) {
                console.error('Error fetching single news item:', error);
                newsDetailDiv.innerHTML = '<p>新闻加载失败或不存在。</p><button class="back-btn" onclick="showNewsList()">← 返回新闻列表</button>';
                return;
            }
        }

        document.getElementById('detail-title').textContent = news.title;
        document.getElementById('detail-author').textContent = `作者: ${news.author}`;
        document.getElementById('detail-date').textContent = `发布日期: ${news.date}`;
        document.getElementById('detail-category').textContent = news.category;
        document.getElementById('detail-image').src = news.image || 'https://via.placeholder.com/800x400?text=No+Image';
        document.getElementById('detail-image').alt = news.title;
        document.getElementById('detail-content').innerHTML = news.content.replace(/\n/g, '<br>'); // Preserve line breaks

        const deleteBtn = document.getElementById('detail-delete-btn');
        if (!news.isDefault) { // Only show delete button for non-default news
            deleteBtn.style.display = 'inline-block';
            deleteBtn.onclick = () => deleteNews(news.id);
        } else {
            deleteBtn.style.display = 'none';
        }
    }

    // Show news list page
    window.showNewsList = function() {
        newsListDiv.style.display = 'grid';
        newsDetailDiv.style.display = 'none';
        // Reset active class for navigation
        navLinks.forEach(link => link.classList.remove('active'));
        document.querySelector('.nav-links a[onclick="filterNews(\'all\')"]').classList.add('active');
        fetchNews(); // Re-fetch news to ensure latest data
    };

    // Filter news by category
    window.filterNews = function(category) {
        navLinks.forEach(link => link.classList.remove('active'));
        event.target.classList.add('active');

        let filteredNews = [];
        if (category === 'all') {
            filteredNews = allNews;
        } else {
            filteredNews = allNews.filter(news => news.category === category);
        }
        displayNews(filteredNews);
    };

    // Open add news modal
    window.openAddNewsModal = function() {
        addNewsModal.style.display = 'block';
        successMessage.style.display = 'none'; // Hide success message on open
        addNewsForm.reset(); // Clear form fields
    };

    // Close add news modal
    window.closeAddNewsModal = function() {
        addNewsModal.style.display = 'none';
    };

    // Handle add news form submission
    addNewsForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(addNewsForm);
        const newsData = {
            title: formData.get('title'),
            category: formData.get('category'),
            author: formData.get('author'),
            image: formData.get('image'),
            summary: formData.get('summary'),
            content: formData.get('content')
        };

        try {
            const response = await fetch('/api/news', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newsData)
            });

            if (response.ok) {
                successMessage.style.display = 'block';
                addNewsForm.reset();
                fetchNews(); // Refresh news list
                setTimeout(() => {
                    closeAddNewsModal();
                }, 2000);
            } else {
                alert('添加新闻失败！');
            }
        } catch (error) {
            console.error('Error adding news:', error);
            alert('添加新闻失败！');
        }
    });

    // Delete news
    window.deleteNews = async function(id) {
        if (!confirm('确定要删除这条新闻吗？')) {
            return;
        }

        try {
            const response = await fetch(`/api/news/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('新闻删除成功！');
                showNewsList(); // Go back to list and refresh
            } else {
                alert('新闻删除失败！');
            }
        } catch (error) {
            console.error('Error deleting news:', error);
            alert('新闻删除失败！');
        }
    };

    // Initial fetch and display
    fetchNews();
});

// Default news data (for fallback if backend is not available)
const defaultNews = [
    {
        id: 1,
        title: "中国经济展现强大韧性，第三季度GDP同比增长4.9%",
        category: "经济",
        author: "李明华",
        date: "2024-01-15",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
        summary: "国家统计局发布最新数据显示，中国经济在复杂多变的国际环境下展现出强大韧性，第三季度GDP同比增长4.9%，超出市场预期...",
        content: `国家统计局今日发布的最新数据显示，中国经济在复杂多变的国际环境下展现出强大韧性。第三季度GDP同比增长4.9%，超出市场预期的4.5%。\n\n这一增长数据反映了中国经济的内生动力不断增强。从产业结构来看，第三产业增加值同比增长5.3%，对经济增长的贡献率达到62.8%。制造业投资同比增长6.2%，显示出实体经济的活力。\n\n专家分析认为，这一成绩的取得主要得益于以下几个方面：\n\n一是内需潜力持续释放。消费市场逐步回暖，1-9月份，社会消费品零售总额同比增长6.8%，其中网上零售额增长11.6%。\n\n二是创新驱动发展成效显著。高技术制造业增加值同比增长11.3%，明显快于规模以上工业增速。\n\n三是对外贸易保持稳定。前三季度货物贸易进出口总值30.44万亿元，同比增长0.2%，在全球贸易低迷的背景下实现了正增长。\n\n展望第四季度，专家普遍认为，随着各项政策措施的持续发力，中国经济有望继续保持稳中向好的发展态势。`,
        isDefault: true
    },
    {
        id: 2,
        title: "人工智能技术在医疗领域取得重大突破",
        category: "科技",
        author: "张科研",
        date: "2024-01-14",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400",
        summary: "最新研究表明，AI诊断系统在早期癌症检测方面的准确率已达到95%以上，为精准医疗提供了强有力的技术支撑...",
        content: `近日，由中科院牵头的多家科研院所联合发布了人工智能在医疗诊断领域的最新研究成果。该研究表明，基于深度学习的AI诊断系统在早期癌症检测方面的准确率已达到95%以上，为精准医疗提供了强有力的技术支撑。\n\n这套AI诊断系统采用了最先进的卷积神经网络和transformer架构，通过对超过100万例医学影像数据的训练，能够准确识别肺癌、乳腺癌、肝癌等多种常见癌症的早期征象。\n\n研究团队负责人表示："这项技术的突破性在于，它不仅能够提高诊断准确率，还能大幅缩短诊断时间。原本需要专家数小时才能完成的影像分析，现在只需几分钟就能得出结果。"\n\n临床试验数据显示，该系统在实际应用中表现出色：\n• 肺癌早期检测准确率达到96.7%\n• 乳腺癌筛查敏感性达到94.3%\n• 误诊率降低至2.1%\n• 诊断时间缩短85%\n\n目前，这套系统已在全国50多家三甲医院开始试点应用，预计年内将在更多医疗机构推广使用。专家预测，这项技术的普及将极大提升我国癌症早期发现率，挽救更多患者生命。\n\n此外，该技术还有望扩展到其他疾病的诊断领域，包括心血管疾病、神经系统疾病等，为构建智慧医疗体系奠定坚实基础。`,
        isDefault: true
    },
    {
        id: 3,
        title: "新能源汽车产业迎来爆发式增长",
        category: "经济",
        author: "王产业",
        date: "2024-01-13",
        image: "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400",
        summary: "2024年新能源汽车销量预计突破1000万辆，充电基础设施建设全面加速，产业链不断完善...",
        content: `据中国汽车工业协会最新统计数据显示，2024年前11个月，我国新能源汽车产销量分别达到958.5万辆和942.3万辆，同比增长35.9%和35.1%。预计全年销量将突破1000万辆大关，创历史新高。\n\n新能源汽车市场的快速发展得益于多重因素：\n\n**政策支持持续发力**\n国家继续实施新能源汽车购置税减免政策，各地方政府也出台了相应的补贴和优惠措施。同时，双积分政策的实施推动传统车企加快新能源转型。\n\n**技术创新不断突破**\n电池技术持续进步，能量密度不断提升，成本持续下降。磷酸铁锂电池、三元锂电池技术日趋成熟，固态电池等新技术研发加速推进。\n\n**基础设施日益完善**\n截至11月底，全国充电基础设施累计数量为821.8万台，同比增长51.6%。高速公路服务区充电设施覆盖率达到95%以上。\n\n**产业链协同发展**\n从上游的锂矿开采、电池制造，到中游的整车生产，再到下游的销售服务，整个产业链不断完善和优化。\n\n市场分析师认为，随着技术进步和成本下降，新能源汽车的竞争优势将进一步凸显，预计未来几年仍将保持高速增长态势。`,
        isDefault: true
    }
];