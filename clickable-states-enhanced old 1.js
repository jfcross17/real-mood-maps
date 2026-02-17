// Enhanced modal with velocity, insights, and dynamic content
window.addEventListener('load', function() {
    // Create enhanced modal HTML
    const modalHTML = `
        <div id="state-modal" style="display:none; position:fixed; z-index:9999; left:0; top:0; width:100%; height:100%; background-color:rgba(0,0,0,0.8); overflow-y:auto;">
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); margin:3% auto; padding:0; border-radius:20px; width:700px; max-width:95%; color:#eee; box-shadow:0 8px 40px rgba(0,0,0,0.6); font-size:16px; border: 1px solid rgba(255,255,255,0.1);">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding:30px; border-radius:20px 20px 0 0; position:relative;">
                    <span id="close-modal" style="color:white; position:absolute; right:20px; top:20px; font-size:32px; font-weight:bold; cursor:pointer; line-height:20px; opacity:0.8; transition:opacity 0.3s;">&times;</span>
                    <h2 id="modal-state-name" style="margin:0; color:white; font-size:36px; font-weight:800;"></h2>
                    <div id="modal-story" style="margin-top:15px; font-size:18px; opacity:0.95; line-height:1.5;"></div>
                </div>
                
                <!-- Content -->
                <div id="modal-content" style="padding:30px;"></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.getElementById('state-modal');
    const closeBtn = document.getElementById('close-modal');
    const modalContent = document.getElementById('modal-content');
    const modalStateName = document.getElementById('modal-state-name');
    const modalStory = document.getElementById('modal-story');
    
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };
    
    closeBtn.onmouseover = function() {
        this.style.opacity = '1';
    };
    
    closeBtn.onmouseout = function() {
        this.style.opacity = '0.8';
    };
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
    
    // Helper function to get velocity indicator
    function getVelocityIndicator(velocity, velocityPercent) {
        if (!velocity || velocity === 0) return '→ Stable';
        
        const absVelocity = Math.abs(velocity);
        const direction = velocity > 0 ? '↑' : '↓';
        const color = velocity > 0 ? '#ef4444' : '#10b981';
        const label = velocity > 0 ? 'Rising' : 'Falling';
        
        return `<span style="color:${color};">${direction} ${label} (${velocity > 0 ? '+' : ''}${velocity} pts, ${velocityPercent > 0 ? '+' : ''}${velocityPercent}%)</span>`;
    }
    
    // Global function to toggle emotion breakdown
    window.toggleEmotionBreakdown = function(emotionKey, stateName) {
        const breakdownDiv = document.getElementById(`breakdown-${emotionKey}`);
        
        // Define which concerns drive which emotions
        const emotionDrivers = {
            anxiety: ['layoffs', 'unemployment', 'crime', 'recession fears', 'job security', 'inflation', 'financial crisis', 'market crash'],
            hope: ['good news', 'breakthrough', 'market rally', 'opportunity', 'recovery'],
            stress: ['cost of living', 'housing costs', 'gas prices', 'rent prices', 'taxes', 'student debt', 'healthcare costs'],
            fear: ['crime', 'financial crisis', 'market crash', 'layoffs', 'homelessness', 'recession fears', 'border crisis'],
            depression: ['unemployment', 'layoffs', 'crime', 'homelessness', 'student debt', 'healthcare costs', 'inflation']
        };
        
        if (breakdownDiv.style.display === 'none') {
            // Load and show breakdown
            fetch('sentiment_results.json')
                .then(response => response.json())
                .then(sentimentData => {
                    const stateData = sentimentData.state_data[stateName];
                    
                    // Generate breakdown content
                    let breakdownHTML = `
                        <div style="font-size:14px; color:#fcd34d; margin-bottom:10px; font-weight:600;">
                            What's Driving ${emotionKey.charAt(0).toUpperCase() + emotionKey.slice(1)}:
                        </div>
                    `;
                    
                    // Get top concerns and filter by emotion relevance
                    if (stateData.top_concerns && stateData.top_concerns.length > 0) {
                        // Filter concerns that match this emotion's drivers
                        const relevantDrivers = emotionDrivers[emotionKey] || [];
                        
                        const relevantConcerns = stateData.top_concerns
                            .filter(concern => relevantDrivers.includes(concern.concern.toLowerCase()))
                            .sort((a, b) => b.value - a.value)
                            .slice(0, 5);
                        
                        if (relevantConcerns.length > 0) {
                            relevantConcerns.forEach(concern => {
                                const intensity = concern.value >= 70 ? '🔴 High' : 
                                                concern.value >= 50 ? '🟡 Medium' : '🟢 Low';
                                
                                breakdownHTML += `
                                    <div style="margin:8px 0; padding:8px; background:rgba(0,0,0,0.2); border-radius:6px; font-size:13px;">
                                        <div style="display:flex; justify-content:space-between; align-items:center;">
                                            <span>${intensity} ${concern.concern}</span>
                                            <span style="font-weight:bold; color:#ef4444;">${concern.value}</span>
                                        </div>
                                    </div>
                                `;
                            });
                        } else {
                            // No relevant concerns found - show top general concerns
                            breakdownHTML += `
                                <div style="color:#888; font-size:13px; margin-bottom:10px;">
                                    No specific ${emotionKey}-related concerns detected.
                                </div>
                                <div style="font-size:12px; color:#666;">
                                    Top concerns in general:
                                </div>
                            `;
                            
                            stateData.top_concerns.slice(0, 3).forEach(concern => {
                                breakdownHTML += `
                                    <div style="margin:6px 0; padding:6px; background:rgba(0,0,0,0.15); border-radius:4px; font-size:12px;">
                                        <span>${concern.concern}: ${concern.value}</span>
                                    </div>
                                `;
                            });
                        }
                    } else {
                        breakdownHTML += `<div style="color:#888; font-size:13px;">No detailed breakdown available</div>`;
                    }
                    
                    breakdownHTML += `
                        <div style="margin-top:12px; font-size:12px; color:#888;">
                            💡 Click again to hide
                        </div>
                    `;
                    
                    breakdownDiv.innerHTML = breakdownHTML;
                    breakdownDiv.style.display = 'block';
                });
        } else {
            // Hide breakdown
            breakdownDiv.style.display = 'none';
        }
    };
    
    // Helper function to get concern trend icon
    function getTrendIcon(value) {
        if (value >= 70) return '🔴';
        if (value >= 50) return '🟡';
        if (value >= 30) return '🟢';
        return '⚪';
    }
    
    // Generate story/insight
    function generateStory(stateName, data, nationalAvg) {
        const parts = [];
        
        // Velocity insight
        if (data.velocity && Math.abs(data.velocity) >= 5) {
            if (data.velocity > 0) {
                parts.push(`Anxiety ${data.velocity >= 10 ? 'SPIKED' : 'jumped'} ${Math.abs(data.velocity)} points in the last ${data.time_delta_hours || 1} hours`);
            } else {
                parts.push(`Anxiety dropped ${Math.abs(data.velocity)} points - cooling down`);
            }
        } else {
            parts.push(`Emotional levels stable`);
        }
        
        // National comparison
        const diff = data.anxiety - nationalAvg.anxiety;
        if (Math.abs(diff) >= 5) {
            const comparison = diff > 0 ? 'more anxious' : 'calmer';
            parts.push(`${Math.round(Math.abs(diff))} pts ${comparison} than national average`);
        }
        
        // Top concern highlight
        if (data.top_concerns && data.top_concerns.length > 0) {
            const topConcern = data.top_concerns[0];
            if (topConcern.value >= 70) {
                parts.push(`"${topConcern.concern}" searches are extremely high`);
            }
        }
        
        return parts.join('. ') + '.';
    }
    
    setTimeout(function() {
        fetch('sentiment_results.json')
            .then(response => response.json())
            .then(sentimentData => {
                const states = document.querySelectorAll('.state-path');
                
                // Calculate national averages
                const stateDataArray = Object.values(sentimentData.state_data || {});
                const nationalAvg = {
                    anxiety: stateDataArray.reduce((sum, s) => sum + (s.anxiety || 0), 0) / stateDataArray.length,
                    hope: stateDataArray.reduce((sum, s) => sum + (s.hope || 0), 0) / stateDataArray.length,
                    stress: stateDataArray.reduce((sum, s) => sum + (s.stress || 0), 0) / stateDataArray.length
                };
                
                states.forEach(state => {
                    state.style.cursor = 'pointer';
                    
                    state.addEventListener('click', function(e) {
                        const stateName = this.getAttribute('data-name') || 'Unknown State';
                        const stateData = sentimentData.state_data[stateName];
                        
                        if (stateData) {
                            // Set state name
                            modalStateName.textContent = stateName;
                            
                            // Generate and set story
                            const story = generateStory(stateName, stateData, nationalAvg);
                            modalStory.textContent = story;
                            
                            let content = '';
                            
                            // EMOTIONAL SNAPSHOT
                            content += `
                                <div style="background: rgba(255,255,255,0.05); padding:20px; border-radius:12px; margin-bottom:25px;">
                                    <h3 style="color:#fcd34d; margin-top:0; margin-bottom:20px; font-size:18px; text-transform:uppercase; letter-spacing:1px;">📊 Emotional Snapshot</h3>
                                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; font-size:16px;">
                            `;
                            
                            // All emotional metrics - but only anxiety and hope are clickable
                            const emotions = [
                                { key: 'anxiety', label: '😰 Anxiety', emoji: '😰', clickable: true },
                                { key: 'hope', label: '💚 Hope', emoji: '💚', clickable: true },
                                { key: 'stress', label: '😓 Stress', emoji: '😓', clickable: false },
                                { key: 'fear', label: '😨 Fear', emoji: '😨', clickable: false },
                                { key: 'depression', label: '😔 Depression', emoji: '😔', clickable: false }
                            ];
                            
                            emotions.forEach(emotion => {
                                const value = stateData[emotion.key] || 0;
                                const velocity = stateData.velocity || 0;
                                const velocityPercent = stateData.velocity_percent || 0;
                                
                                if (emotion.clickable) {
                                    // Clickable version (anxiety and hope)
                                    content += `
                                        <div style="padding:12px; background: rgba(255,255,255,0.03); border-radius:8px; cursor:pointer; transition:background 0.2s;" 
                                             onmouseover="this.style.background='rgba(255,255,255,0.08)'" 
                                             onmouseout="this.style.background='rgba(255,255,255,0.03)'"
                                             onclick="toggleEmotionBreakdown('${emotion.key}', '${stateName}')">
                                            <div style="font-size:18px; margin-bottom:5px;">${emotion.emoji} ${emotion.label.split(' ')[1]} 🔍</div>
                                            <div style="font-size:28px; font-weight:bold; margin-bottom:5px;">${value}</div>
                                            ${emotion.key === 'anxiety' && velocity !== 0 ? 
                                                `<div style="font-size:14px; opacity:0.8;">${getVelocityIndicator(velocity, velocityPercent)}</div>` 
                                                : ''}
                                            <div id="breakdown-${emotion.key}" style="display:none; margin-top:15px; padding-top:15px; border-top:1px solid rgba(255,255,255,0.1);"></div>
                                        </div>
                                    `;
                                } else {
                                    // Non-clickable version (stress, fear, depression)
                                    content += `
                                        <div style="padding:12px; background: rgba(255,255,255,0.03); border-radius:8px;">
                                            <div style="font-size:18px; margin-bottom:5px;">${emotion.emoji} ${emotion.label.split(' ')[1]}</div>
                                            <div style="font-size:28px; font-weight:bold; margin-bottom:5px;">${value}</div>
                                        </div>
                                    `;
                                }
                            });
                            
                            content += `
                                    </div>
                                </div>
                            `;
                            
                            // TOP CONCERNS (Enhanced)
                            if (stateData.top_concerns && stateData.top_concerns.length > 0) {
                                content += `
                                    <div style="margin-bottom:25px;">
                                        <h3 style="color:#ef4444; margin-top:0; margin-bottom:20px; font-size:18px; text-transform:uppercase; letter-spacing:1px;">🔥 What's Trending</h3>
                                `;
                                
                                stateData.top_concerns.forEach((item, index) => {
                                    const trendsUrl = `https://trends.google.com/trends/explore?geo=US&q=${encodeURIComponent(item.concern)}`;
                                    const icon = getTrendIcon(item.value);
                                    
                                    content += `
                                        <div style="margin-bottom:20px; padding:20px; background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%); border-radius:12px; border-left: 4px solid #ef4444;">
                                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                                                <div style="font-size:20px; font-weight:bold;">
                                                    ${icon} ${index + 1}. ${item.concern.charAt(0).toUpperCase() + item.concern.slice(1)}
                                                </div>
                                                <div style="font-size:24px; font-weight:bold; color:#ef4444;">${item.value}</div>
                                            </div>
                                    `;
                                    
                                    // Related searches
                                    if (item.related_searches && item.related_searches.length > 0) {
                                        content += `
                                            <div style="margin-top:12px; padding:12px; background: rgba(0,0,0,0.2); border-radius:8px; font-size:14px;">
                                                <div style="color:#888; margin-bottom:8px; font-weight:600;">🔍 What people are searching:</div>
                                        `;
                                        item.related_searches.forEach(search => {
                                            content += `<div style="color:#ccc; margin:4px 0; padding-left:10px;">• ${search}</div>`;
                                        });
                                        content += `</div>`;
                                    }
                                    
                                    // Google Trends button
                                    content += `
                                            <a href="${trendsUrl}" target="_blank" style="display:inline-block; margin-top:12px; padding:10px 20px; background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%); color:#1a1a2e; text-decoration:none; border-radius:8px; font-weight:bold; font-size:14px; transition:transform 0.2s; box-shadow:0 2px 8px rgba(0,212,255,0.3);">
                                                📊 View Google Trends Data
                                            </a>
                                        </div>
                                    `;
                                });
                                
                                content += `</div>`;
                            }
                            
                            // COMPARISON SECTION
                            content += `
                                <div style="background: rgba(255,255,255,0.03); padding:20px; border-radius:12px; margin-bottom:20px;">
                                    <h3 style="color:#10b981; margin-top:0; margin-bottom:15px; font-size:18px; text-transform:uppercase; letter-spacing:1px;">📈 Comparison</h3>
                                    <div style="font-size:16px; line-height:1.8;">
                            `;
                            
                            // National comparison
                            const anxietyDiff = stateData.anxiety - nationalAvg.anxiety;
                            const hopeDiff = stateData.hope - nationalAvg.hope;
                            
                            content += `
                                        <div>
                                            <strong>vs. National Average:</strong><br>
                                            Anxiety: ${anxietyDiff > 0 ? '+' : ''}${Math.round(anxietyDiff)} pts ${anxietyDiff > 0 ? 'higher' : 'lower'}<br>
                                            Hope: ${hopeDiff > 0 ? '+' : ''}${Math.round(hopeDiff)} pts ${hopeDiff > 0 ? 'higher' : 'lower'}
                                        </div>
                            `;
                            
                            content += `
                                    </div>
                                </div>
                            `;
                            
                            // LAST UPDATED
                            if (stateData.time_delta_hours !== undefined) {
                                const lastUpdated = sentimentData.last_updated || 'Unknown';
                                content += `
                                    <div style="text-align:center; color:#888; font-size:14px; margin-top:20px;">
                                        Last updated: ${new Date(lastUpdated).toLocaleString()}<br>
                                        Data collected over ${stateData.time_delta_hours.toFixed(1)} hours
                                    </div>
                                `;
                            }
                            
                            modalContent.innerHTML = content;
                            modal.style.display = 'block';
                        }
                    });
                    
                    state.addEventListener('mouseenter', function() {
                        this.style.opacity = '0.7';
                    });
                    
                    state.addEventListener('mouseleave', function() {
                        this.style.opacity = '1';
                    });
                });
                
                console.log('Enhanced clickable states initialized! 🚀');
            })
            .catch(error => {
                console.error('Error loading sentiment data:', error);
            });
    }, 1000);
});
