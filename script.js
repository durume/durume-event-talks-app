document.addEventListener('DOMContentLoaded', () => {
    const talksData = [
        {
            id: 'talk-1',
            title: 'The Future of AI in Software Development',
            speakers: ['Dr. Anya Sharma'],
            category: ['AI', 'Development'],
            duration: 60,
            description: 'Explore the latest advancements in AI and its transformative impact on software engineering practices, from automated code generation to intelligent debugging.'
        },
        {
            id: 'talk-2',
            title: 'Mastering Microservices with Node.js',
            speakers: ['Ben Carter'],
            category: ['Backend', 'Node.js', 'Architecture'],
            duration: 60,
            description: 'Learn best practices for designing, building, and deploying scalable microservices using Node.js, focusing on resilience and communication patterns.'
        },
        {
            id: 'talk-3',
            title: 'Frontend Performance Optimization for Modern Web Apps',
            speakers: ['Chloe Davis', 'David Lee'],
            category: ['Frontend', 'Performance', 'Web'],
            duration: 60,
            description: 'Dive into techniques for boosting frontend performance, including critical rendering path optimization, lazy loading, and advanced caching strategies.'
        },
        {
            id: 'talk-4',
            title: 'Securing Your Cloud Native Applications',
            speakers: ['Eva Green'],
            category: ['Security', 'Cloud', 'DevOps'],
            duration: 60,
            description: 'Understand common security vulnerabilities in cloud-native environments and implement robust security measures for your applications and infrastructure.'
        },
        {
            id: 'talk-5',
            title: 'Data Streaming with Apache Kafka',
            speakers: ['Frank White'],
            category: ['Data', 'Backend', 'Architecture'],
            duration: 60,
            description: 'An introduction to Apache Kafka and its role in building real-time data pipelines and event-driven architectures. Learn core concepts and practical use cases.'
        },
        {
            id: 'talk-6',
            title: 'Introduction to WebAssembly for High-Performance Web Apps',
            speakers: ['Grace Hall'],
            category: ['Web', 'Performance', 'Frontend'],
            duration: 60,
            description: 'Discover WebAssembly (Wasm) and how it enables near-native performance for web applications, opening doors for complex computations and game development in the browser.'
        }
    ];

    const eventStartTime = { hour: 10, minute: 0 }; // 10:00 AM
    const talkDuration = 60; // minutes
    const transitionTime = 10; // minutes
    const lunchBreakDuration = 60; // minutes
    const lunchBreakAfterTalkIndex = 3; // Lunch after the 3rd talk (index 2 in 0-indexed array)

    const scheduleContainer = document.getElementById('schedule-container');
    const categorySearchInput = document.getElementById('category-search');
    const searchButton = document.getElementById('search-button');
    const clearSearchButton = document.getElementById('clear-search-button');

    function formatTime(hour, minute) {
        const h = String(hour).padStart(2, '0');
        const m = String(minute).padStart(2, '0');
        return `${h}:${m}`;
    }

    function calculateSchedule(talks, filterCategory = '') {
        let currentHour = eventStartTime.hour;
        let currentMinute = eventStartTime.minute;
        let scheduledItems = [];
        let talkIndex = 0;

        talks.forEach((talk, index) => {
            if (index === lunchBreakAfterTalkIndex -1) { // Lunch break after talk with this index
                // Add lunch break
                scheduledItems.push({
                    type: 'break',
                    title: 'Lunch Break',
                    duration: lunchBreakDuration,
                    startTime: formatTime(currentHour, currentMinute),
                    endTime: formatTime(currentHour, currentMinute + lunchBreakDuration)
                });
                currentMinute += lunchBreakDuration; // Advance time by lunch duration
                if (currentMinute >= 60) {
                    currentHour += Math.floor(currentMinute / 60);
                    currentMinute %= 60;
                }
            }

            // Add talk
            const talkStartTime = formatTime(currentHour, currentMinute);
            currentMinute += talk.duration;
            if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute %= 60;
            }
            const talkEndTime = formatTime(currentHour, currentMinute);

            const matchesCategory = talk.category.some(cat =>
                cat.toLowerCase().includes(filterCategory.toLowerCase())
            );

            if (filterCategory === '' || matchesCategory) {
                scheduledItems.push({
                    type: 'talk',
                    ...talk,
                    startTime: talkStartTime,
                    endTime: talkEndTime
                });
            }

            // Add transition time if not the last talk and talk was added
            if (index < talks.length -1) {
                currentMinute += transitionTime;
                if (currentMinute >= 60) {
                    currentHour += Math.floor(currentMinute / 60);
                    currentMinute %= 60;
                }
            }
        });

        return scheduledItems;
    }


    function renderSchedule(filterCategory = '') {
        scheduleContainer.innerHTML = ''; // Clear previous schedule

        const filteredTalks = talksData.filter(talk =>
            filterCategory === '' || talk.category.some(cat =>
                cat.toLowerCase().includes(filterCategory.toLowerCase())
            )
        );

        const schedule = calculateSchedule(talksData, filterCategory);

        if (schedule.length === 0) {
            scheduleContainer.innerHTML = '<p>No talks found matching your criteria.</p>';
            return;
        }

        schedule.forEach(item => {
            const div = document.createElement('div');
            if (item.type === 'talk') {
                div.classList.add('talk-slot');
                div.innerHTML = `
                    <div class="time-slot">${item.startTime} - ${item.endTime}</div>
                    <h3>${item.title}</h3>
                    <p><strong>Speakers:</strong> ${item.speakers.join(', ')}</p>
                    <p class="categories">
                        ${item.category.map(cat => `<span>${cat}</span>`).join('')}
                    </p>
                    <div class="talk-description">
                        <p>${item.description}</p>
                    </div>
                `;
                div.addEventListener('click', () => {
                    div.classList.toggle('expanded');
                });
            } else if (item.type === 'break') {
                div.classList.add('talk-slot', 'lunch-break');
                div.innerHTML = `
                    <div class="time-slot">${item.startTime} - ${item.endTime}</div>
                    <h3>${item.title}</h3>
                `;
            }
            scheduleContainer.appendChild(div);
        });
    }

    searchButton.addEventListener('click', () => {
        renderSchedule(categorySearchInput.value.trim());
    });

    clearSearchButton.addEventListener('click', () => {
        categorySearchInput.value = '';
        renderSchedule();
    });

    // Initial render
    renderSchedule();
});
