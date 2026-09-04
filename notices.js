const notices = [
    {
        id: 'metronome-mobile-audio',
        title: 'Mobile Metronome Notice',
        message: 'There is a known issue with the metronome on some mobile devices. Before starting the metronome, press any tuner button once so the metronome audio can be heard.'
    }
];

const mobileNotice = document.querySelector('#mobile-notice');
const mobileNoticeTitle = document.querySelector('#mobile-notice-title');
const mobileNoticeMessage = document.querySelector('#mobile-notice-message');
const closeMobileNoticeButton = document.querySelector('#close-mobile-notice');
const currentNotice = notices[0];

function isMobileDevice() {
    const mobileUserAgent = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const smallViewport = window.matchMedia('(max-width: 768px)').matches;
    const touchDevice = window.matchMedia('(pointer: coarse)').matches;
    return mobileUserAgent || (smallViewport && touchDevice);
}

function showMobileNotice(notice) {
    mobileNoticeTitle.textContent = notice.title;
    mobileNoticeMessage.textContent = notice.message;
    mobileNotice.hidden = false;
    mobileNotice.setAttribute('aria-hidden', 'false');
    closeMobileNoticeButton.focus();
}

function closeMobileNotice() {
    mobileNotice.hidden = true;
    mobileNotice.setAttribute('aria-hidden', 'true');
}

closeMobileNoticeButton.addEventListener('click', closeMobileNotice);
mobileNotice.addEventListener('click', (event) => {
    if (event.target === mobileNotice) {
        closeMobileNotice();
    }
});

if (isMobileDevice()) {
    showMobileNotice(currentNotice);
} else {
    mobileNotice.setAttribute('aria-hidden', 'true');
}
