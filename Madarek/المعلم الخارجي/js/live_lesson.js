let meeting;
let localParticipantId = null;
let isMicOn = false;
let isCameraOn = false;
let isScreenSharing = false;

function getTeacherViewHTML(meetingName) {
    return `
<div class="card flex flex-col h-full">
    <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-4 border-b border-gray-200 gap-2">
        <h2 id="live-lesson-title" class="card-title mb-0 text-lg sm:text-xl">درس مباشر: ${meetingName}</h2>
        <span id="stream-status-indicator" class="text-sm font-medium text-red-600 flex items-center self-start sm:self-center">
            <i data-lucide="circle" class="w-3 h-3 fill-current inline-block ml-1 status-dot"></i> <span id="status-text">غير متصل</span>
        </span>
    </div>
    <div id="video-stream-container" class="flex-grow bg-gray-800 rounded-lg mb-6 overflow-hidden relative flex items-center justify-center text-gray-400 min-h-[200px] sm:min-h-[300px] md:min-h-[400px]">
        <div id="local-participant-video-container" class="w-full h-full absolute top-0 left-0"></div>
        <div id="remote-participants-video-container" class="w-1/3 h-1/3 sm:w-1/4 sm:h-1/4 absolute bottom-2 right-2 sm:bottom-4 sm:right-4 border-2 border-gray-700 rounded bg-black overflow-hidden"></div>
        <div class="initial-placeholder text-center p-4">
            <i data-lucide="video-off" class="w-12 h-12 sm:w-16 sm:h-16 inline-block"></i>
            <p class="ml-0 sm:ml-4 text-base sm:text-xl mt-2">انقر على "بدء البث" لتشغيل الكاميرا والميكروفون</p>
        </div>
    </div>
    <div id="teacher-controls" class="flex flex-wrap justify-center items-center gap-3">
        <button id="start-stop-stream-btn" class="btn btn-primary">
            <i data-lucide="video" class="w-5 h-5"></i>
            <span>بدء البث</span>
        </button>
        <button id="mute-audio-btn" class="btn btn-outline" disabled>
             <i data-lucide="mic" class="w-5 h-5"></i>
            <span data-unmuted-text="كتم الصوت" data-muted-text="إلغاء كتم الصوت">كتم الصوت</span>
        </button>
        <button id="mute-video-btn" class="btn btn-outline" disabled>
             <i data-lucide="camera" class="w-5 h-5"></i>
            <span data-unmuted-text="إيقاف الفيديو" data-muted-text="تشغيل الفيديو">إيقاف الفيديو</span>
        </button>
        <button id="share-screen-btn" class="btn btn-outline" disabled>
             <i data-lucide="screen-share" class="w-5 h-5"></i>
            <span data-unshared-text="مشاركة الشاشة" data-shared-text="إيقاف المشاركة">مشاركة الشاشة</span>
        </button>
    </div>
</div>`;
}

function getStudentViewHTML(meetingName) {
    return `
<div class="card flex flex-col h-full">
     <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-4 border-b border-gray-200 gap-2">
        <h2 id="live-lesson-title" class="card-title mb-0 text-lg sm:text-xl">درس مباشر: ${meetingName}</h2>
        <span id="stream-status-indicator" class="text-sm font-medium text-gray-600 flex items-center self-start sm:self-center">
             <i data-lucide="circle" class="w-3 h-3 fill-current inline-block ml-1 status-dot"></i> <span id="status-text">انتظار المعلم...</span>
        </span>
    </div>
    <div id="video-stream-container" class="flex-grow bg-gray-800 rounded-lg mb-6 overflow-hidden flex items-center justify-center text-gray-400 min-h-[200px] sm:min-h-[300px] md:min-h-[400px]">
        <div id="remote-participants-video-container" class="w-full h-full"></div>
         <div class="initial-placeholder text-center p-4">
             <i data-lucide="video-off" class="w-12 h-12 sm:w-16 sm:h-16 inline-block"></i>
            <p class="ml-0 sm:ml-4 text-base sm:text-xl mt-2" id="student-video-status-message">انتظار المعلم لبدء البث...</p>
        </div>
    </div>
</div>`;
}

function updateStreamStatus(text, colorClass, dotFillClass = 'fill-current') {
    const statusTextEl = document.getElementById('status-text');
    const statusIndicatorEl = document.getElementById('stream-status-indicator');
    const statusDotEl = statusIndicatorEl ? statusIndicatorEl.querySelector('.status-dot') : null;

    if (statusTextEl) statusTextEl.textContent = text;
    if (statusIndicatorEl) {
        statusIndicatorEl.className = `text-sm font-medium flex items-center self-start sm:self-center ${colorClass}`;
    }
    if (statusDotEl) {
        statusDotEl.className = `w-3 h-3 inline-block ml-1 status-dot ${dotFillClass}`;
    }
}

function createParticipantVideoElement(participantId) {
    let videoElement = document.createElement("video");
    videoElement.id = `v-${participantId}`;
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    videoElement.classList.add("w-full", "h-full", "object-contain");
    return videoElement;
}

function setupTeacherControls() {
    const startStopBtn = document.getElementById('start-stop-stream-btn');
    const muteAudioBtn = document.getElementById('mute-audio-btn');
    const muteVideoBtn = document.getElementById('mute-video-btn');
    const shareScreenBtn = document.getElementById('share-screen-btn');

    startStopBtn.addEventListener('click', async () => {
        if (!meeting) return;
        if (meeting.localParticipant.isMeetingJoined()) { 
            meeting.end(); 
            updateStreamStatus('تم إنهاء البث', 'text-red-600');
            startStopBtn.innerHTML = `<i data-lucide="video" class="w-5 h-5"></i> <span>بدء البث</span>`;
            lucide.createIcons();
            [muteAudioBtn, muteVideoBtn, shareScreenBtn].forEach(btn => btn.disabled = true);
            const placeholder = document.querySelector('.initial-placeholder');
            if(placeholder) placeholder.style.display = 'block';
        } else {
            try {
                await meeting.join(); 
                updateStreamStatus('جاري الاتصال...', 'text-yellow-500');
                startStopBtn.innerHTML = `<i data-lucide="square" class="w-5 h-5"></i> <span>إنهاء البث</span>`;
                lucide.createIcons();
                 [muteAudioBtn, muteVideoBtn, shareScreenBtn].forEach(btn => btn.disabled = false);
                 const placeholder = document.querySelector('.initial-placeholder');
                 if(placeholder) placeholder.style.display = 'none';
            } catch (error) {
                console.error("Error starting/joining meeting:", error);
                updateStreamStatus('فشل الاتصال', 'text-red-600');
                 startStopBtn.innerHTML = `<i data-lucide="video" class="w-5 h-5"></i> <span>بدء البث</span>`;
                 lucide.createIcons();
            }
        }
    });
    
    muteAudioBtn.addEventListener('click', () => {
        if (!meeting || !meeting.localParticipant.isMeetingJoined()) return;
        const micIcon = muteAudioBtn.querySelector('i');
        const micText = muteAudioBtn.querySelector('span');
        if (isMicOn) {
            meeting.muteMic();
            micIcon.setAttribute('data-lucide', 'mic-off');
            micText.textContent = micText.dataset.mutedText;
        } else {
            meeting.unmuteMic();
            micIcon.setAttribute('data-lucide', 'mic');
            micText.textContent = micText.dataset.unmutedText;
        }
        isMicOn = !isMicOn;
        lucide.createIcons();
    });

    muteVideoBtn.addEventListener('click', () => {
        if (!meeting || !meeting.localParticipant.isMeetingJoined()) return;
        const camIcon = muteVideoBtn.querySelector('i');
        const camText = muteVideoBtn.querySelector('span');
        if (isCameraOn) {
            meeting.disableWebcam();
            camIcon.setAttribute('data-lucide', 'video-off');
            camText.textContent = camText.dataset.mutedText;
        } else {
            meeting.enableWebcam();
            camIcon.setAttribute('data-lucide', 'video');
            camText.textContent = camText.dataset.unmutedText;
        }
        isCameraOn = !isCameraOn;
        lucide.createIcons();
    });

    shareScreenBtn.addEventListener('click', async () => {
        if (!meeting || !meeting.localParticipant.isMeetingJoined()) return;
        const screenIcon = shareScreenBtn.querySelector('i');
        const screenText = shareScreenBtn.querySelector('span');
        if (isScreenSharing) {
            meeting.disableScreenShare();
            screenIcon.setAttribute('data-lucide', 'screen-share');
            screenText.textContent = screenText.dataset.unsharedText;
        } else {
            try {
                await meeting.enableScreenShare();
                screenIcon.setAttribute('data-lucide', 'monitor-off'); 
                screenText.textContent = screenText.dataset.sharedText;
            } catch (error) {
                console.error("Error enabling screen share:", error);
                alert("فشل في مشاركة الشاشة. تأكد من منح الأذونات اللازمة.");
                return; 
            }
        }
        isScreenSharing = !isScreenSharing;
        lucide.createIcons();
    });
}

async function fetchVideoSDKCredentials(meetingId, role) {
    updateStreamStatus('جاري جلب بيانات الاعتماد...', 'text-yellow-500');
    try {
        const response = await fetch(`/api/live-lessons/credentials`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ meetingId, role })
        });
        if (!response.ok) {
            throw new Error(`فشل جلب بيانات الاعتماد: ${response.status} ${response.statusText}`);
        }
        const credentials = await response.json();
        if (!credentials.apiKey || !credentials.token) {
            throw new Error('بيانات الاعتماد المستلمة غير مكتملة.');
        }
        return credentials;
    } catch (error) {
        console.error("Error fetching VideoSDK credentials:", error);
        updateStreamStatus(`فشل جلب بيانات الاعتماد: ${error.message}`, 'text-red-600');
        const container = document.getElementById('live-lesson-container');
        if (container) {
             container.innerHTML = `<p class="text-red-500 text-center p-4">خطأ في جلب بيانات جلسة البث المباشر. ${error.message}</p>`;
        }
        return null;
    }
}


async function initializeVideoSDK(meetingId, role, userName) {
    const credentials = await fetchVideoSDKCredentials(meetingId, role);
    if (!credentials) {
        return; 
    }

    meeting = VideoSDK.initMeeting({
        meetingId: meetingId,
        apiKey: credentials.apiKey, 
        token: credentials.token, 
        name: userName,
        micEnabled: false, 
        webcamEnabled: false, 
        participantCanToggleSelfWebcam: true,
        participantCanToggleSelfMic: true,
    });

    if (!meeting) {
        console.error("Failed to initialize VideoSDK Meeting");
        updateStreamStatus('فشل تهيئة SDK', 'text-red-600');
        const container = document.getElementById('live-lesson-container');
        if (container) {
             container.innerHTML = '<p class="text-red-500 text-center p-4">خطأ في تهيئة جلسة البث المباشر. يرجى المحاولة لاحقاً.</p>';
        }
        return;
    }

    meeting.on("meeting-joined", () => {
        localParticipantId = meeting.localParticipant.id;
        updateStreamStatus('متصل', 'text-green-500', 'fill-green-500');
        if (role === 'teacher') {
            meeting.enableWebcam();
            isCameraOn = true;
            document.getElementById('mute-video-btn').querySelector('i').setAttribute('data-lucide', 'video');
            document.getElementById('mute-video-btn').querySelector('span').textContent = document.getElementById('mute-video-btn').querySelector('span').dataset.unmutedText;

            meeting.unmuteMic();
            isMicOn = true;
            document.getElementById('mute-audio-btn').querySelector('i').setAttribute('data-lucide', 'mic');
            document.getElementById('mute-audio-btn').querySelector('span').textContent = document.getElementById('mute-audio-btn').querySelector('span').dataset.unmutedText;

            lucide.createIcons();
            const placeholder = document.querySelector('.initial-placeholder');
            if(placeholder) placeholder.style.display = 'none';
        }
    });
    
    meeting.on("meeting-left", () => {
        updateStreamStatus('تم قطع الاتصال', 'text-red-600');
        if (role === 'teacher') {
            const startStopBtn = document.getElementById('start-stop-stream-btn');
            const muteAudioBtn = document.getElementById('mute-audio-btn');
            const muteVideoBtn = document.getElementById('mute-video-btn');
            const shareScreenBtn = document.getElementById('share-screen-btn');
            if (startStopBtn) startStopBtn.innerHTML = `<i data-lucide="video" class="w-5 h-5"></i> <span>بدء البث</span>`;
            lucide.createIcons();
            if (muteAudioBtn && muteVideoBtn && shareScreenBtn) {
                [muteAudioBtn, muteVideoBtn, shareScreenBtn].forEach(btn => btn.disabled = true);
            }
        }
        const localVidContainer = document.getElementById('local-participant-video-container');
        if (localVidContainer) localVidContainer.innerHTML = '';
        const remoteVidContainer = document.getElementById('remote-participants-video-container');
        if (remoteVidContainer) remoteVidContainer.innerHTML = '';
        
        const placeholder = document.querySelector('.initial-placeholder');
        if(placeholder) placeholder.style.display = 'block';
    });

    meeting.on("participant-joined", (participant) => {
        if (role === 'student' && participant.isLocal === false) {
            updateStreamStatus('المعلم متصل', 'text-green-500', 'fill-green-500');
        }
    });
    
    meeting.on("participant-left", (participant) => {
        const videoElement = document.getElementById(`v-${participant.id}`);
        if (videoElement) videoElement.remove();
         if (role === 'student') {
            updateStreamStatus('غادر المعلم', 'text-yellow-500');
            const placeholder = document.querySelector('.initial-placeholder');
            if(placeholder) placeholder.style.display = 'block';
            const studentMsg = document.getElementById('student-video-status-message');
            if(studentMsg) studentMsg.textContent = 'لقد غادر المعلم البث.';
        }
    });

    meeting.on("stream-enabled", (stream, participant) => {
        const placeholder = document.querySelector('.initial-placeholder');
        if(placeholder) placeholder.style.display = 'none';
        
        let videoElement = createParticipantVideoElement(participant.id);
        if (stream.kind === 'video' || stream.kind === 'share') {
            videoElement.srcObject = new MediaStream([stream.track]);
            videoElement.play().catch(e => console.error("Video play error:", e));

            const localVidContainer = document.getElementById('local-participant-video-container');
            const remoteVidContainer = document.getElementById('remote-participants-video-container');

            if (participant.isLocal) {
                if (localVidContainer) {
                    localVidContainer.innerHTML = ''; 
                    localVidContainer.appendChild(videoElement);
                }
            } else {
                if (remoteVidContainer) {
                    remoteVidContainer.innerHTML = ''; 
                    remoteVidContainer.appendChild(videoElement);
                }
                 if (role === 'student') {
                     updateStreamStatus('البث مباشر', 'text-green-500', 'fill-green-500');
                 }
            }
        }
    });

    meeting.on("stream-disabled", (stream, participant) => {
        const videoElement = document.getElementById(`v-${participant.id}`);
        if (videoElement) {
            videoElement.srcObject = null; 
            if (participant.isLocal && stream.kind === 'video') { 
            } else if (!participant.isLocal && stream.kind === 'video' && role === 'student') {
                updateStreamStatus('توقف بث المعلم مؤقتاً', 'text-yellow-500');
                const placeholder = document.querySelector('.initial-placeholder');
                if(placeholder) placeholder.style.display = 'block';
                const studentMsg = document.getElementById('student-video-status-message');
                if(studentMsg) studentMsg.textContent = 'توقف بث المعلم مؤقتاً.';
            }
        }
    });

    if (role === 'student') {
        meeting.join().catch(error => {
            console.error("Student failed to join meeting:", error);
            updateStreamStatus('فشل الانضمام', 'text-red-600');
            const container = document.getElementById('live-lesson-container');
            if(container) container.innerHTML = '<p class="text-red-500 text-center p-4">فشل الانضمام إلى جلسة البث المباشر. يرجى التحقق من الاتصال والمحاولة مرة أخرى.</p>';
        });
    }
}


export async function initLiveLesson(params) {
    const { meetingId, role } = params;
    const userName = role === 'teacher' ? 'المعلم' : 'الطالب'; 
    const meetingName = decodeURIComponent(meetingId || 'درس مباشر');

    const container = document.getElementById('live-lesson-container');
    if (!container) {
        console.error('Live lesson container not found.');
        return;
    }
    
    if (typeof VideoSDK === 'undefined' || typeof VideoSDK.initMeeting === 'undefined') {
        console.error('VideoSDK is not loaded or initMeeting is not a function.');
        container.innerHTML = '<p class="text-red-500 text-center p-4">خطأ: VideoSDK لم يتم تحميله بشكل صحيح. يرجى التأكد من صحة إعدادات SDK.</p>';
        return;
    }
    
    meeting = null;
    localParticipantId = null;
    isMicOn = false;
    isCameraOn = false;
    isScreenSharing = false;

    if (role === 'teacher') {
        container.innerHTML = getTeacherViewHTML(meetingName);
        setupTeacherControls();
    } else if (role === 'student') {
        container.innerHTML = getStudentViewHTML(meetingName);
    } else {
        container.innerHTML = '<p class="text-red-500 text-center p-4">دور المستخدم غير محدد.</p>';
        return;
    }
    lucide.createIcons();
    
    await initializeVideoSDK(meetingId, role, userName);
}
